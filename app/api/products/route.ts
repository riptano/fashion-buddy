import { AstraDB } from "@datastax/astra-db-ts";
import { FindOptions } from "@datastax/astra-db-ts/dist/collections";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";


// Environment variables
const { ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT, GOOGLE_API_KEY } =
  process.env;

// Connect to Astra
const db = new AstraDB(ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT);

// Connect to Google GenAI
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY || "");
const gemini_model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
const embeddings_model = genAI.getGenerativeModel({ model: "embedding-001" });

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Prompt that gets sent to the model
        const prompt = 'describe the clothing items worn in this photo';
        // Image part that gets sent to the model
        const imagePart = {
            inlineData: {
                data: data.imageBase64,
                mimeType: data.fileType,
            },
        };

        const geminiResponse = await gemini_model.generateContent([prompt, imagePart]);

        // Create embeddings of product description 
        const searchPrompt = geminiResponse.response.text();
        const result = await embeddings_model.embedContent(searchPrompt);
        const embedding = result.embedding;
        const vector = embedding.values;

        const collection = await db.collection("fashion_buddy");

        // Apply user selected filters
        let filter = {};
        let categoryFilter;
        let genderFilter;
    
        if (data.filters.categories.length > 0) {
            categoryFilter = {
                $or: data.filters.categories.map(category => ({ category: category }))
            };
        }
        
        if (data.filters.genders.length > 0) {
            if (data.filters.genders.length > 1) {
                genderFilter = {
                    $or: data.filters.genders.map(gender => ({ gender: gender }))
                };
            } else {
                genderFilter = { gender: data.filters.genders[0] };
            }
        }

        // use $and if necessary
        if (categoryFilter && genderFilter) {
            filter = { 
                $and: [
                    categoryFilter,
                    genderFilter
                 ]
            }
        } else if (categoryFilter || genderFilter) {
            filter = categoryFilter ? categoryFilter : genderFilter;
        }

        const options: FindOptions = {
            sort: {
                "$vector": vector
            },
            limit: 10,
            includeSimilarity: true,
            projection: {
                '$vector': 0
            }
        };

        const cursor = collection.find(filter, options);

        const docs = await cursor.toArray();

        return NextResponse.json({ message: geminiResponse.response.text(), products: docs }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

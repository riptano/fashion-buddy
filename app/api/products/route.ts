import { AstraDB } from "@datastax/astra-db-ts";
import { FindOptions } from "@datastax/astra-db-ts/dist/collections";
import { HumanMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { NextResponse } from "next/server";
import { 
    RunnableLambda,
    RunnableSequence
  } from "@langchain/core/runnables";
import { Filters } from "@/utils/types";


// Environment variables
const { ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT, GOOGLE_API_KEY } =
  process.env;

// Connect to Astra
const db = new AstraDB(ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT);

const PROMPT = 'describe the clothing items worn in this photo';

export async function POST(req: Request) {
    try {
        const data = await req.json();

        const gemini_model = new ChatGoogleGenerativeAI({
            apiKey: GOOGLE_API_KEY,
            modelName: "gemini-pro-vision",
            streaming: false,
        })
        
        const embeddings_model = new GoogleGenerativeAIEmbeddings({
            apiKey: GOOGLE_API_KEY,
            modelName: "embedding-001",
        });

        const collection = await db.collection("fashion_buddy");  

        const message = [
                new HumanMessage({
                content: [
                    {
                        type: "text",
                        text: PROMPT, 
                    },
                    {
                        type: "image_url",
                        image_url: data.imageBase64,
                    },
                ]
            })
        ];

        const chain = RunnableSequence.from([
            gemini_model,
            new StringOutputParser(),
            RunnableLambda.from(
                (input: string) => embeddings_model.embedQuery(input),
            ).withConfig({ runName: "Embedding" }),
            RunnableLambda.from(
                (input: number[]) => {
                    const options: FindOptions = {
                        sort: {
                            "$vector": input
                        },
                        limit: 10,
                        includeSimilarity: true,
                        projection: {
                            '$vector': 0
                        }
                    };
                    const cursor = collection.find(getFilters(data.filters), options);
                    return cursor.toArray();
                }
            ).withConfig({ runName: "GetProductsFromAstra" }),
        ])

        const docs = await chain.invoke(message);      

        return NextResponse.json({ products: docs }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

const getFilters = (filters: Filters): Record<string, any> => {
    let filter = {};
    let categoryFilter;
    let genderFilter;

    if (filters.categories.length > 0) {
        categoryFilter = {
            $or: filters.categories.map(category => ({ category: category }))
        };
    }
    
    if (filters.genders.length > 0) {
        if (filters.genders.length > 1) {
            genderFilter = {
                $or: filters.genders.map(gender => ({ gender: gender }))
            };
        } else {
            genderFilter = { gender: filters.genders[0] };
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

    return filter;
}

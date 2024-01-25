import { AstraDB } from "@datastax/astra-db-ts";
import { GoogleGenerativeAI } from "@google/generative-ai";


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
    const data = await req.json();

    // Prompt that gets sent to the model
    const textPart = { text: data.prompt };
    // Image part that gets sent to the model
    const imagePart = {
        inlineData: {
            // base64 of the image
            data: data.imageBase64,
            mimeType: "image/jpeg",
        },
    };

    const geminiResponse = await gemini_model.generateContent([textPart, imagePart]);

    console.log('search prompt:', geminiResponse.response.text());

    // Create embeddings of product description 
    const searchPrompt = geminiResponse.response.text();
    const result = await embeddings_model.embedContent(searchPrompt);
    const embedding = result.embedding;
    const vector = embedding.values;
    console.log(vector);

    // search for similar items on Astra
    const metadataFilter = {category: 'TOPS'}
    const options = {
        sort: {
            "$vector": vector
        },
        limit: 3
    };

    db.collection("fashion_buddy").then((collection: Collection) => {
        collection.find(metadataFilter, options).toArray().then(docs => {
            docs.forEach(doc => console.log(doc));
        })
    });

    return Response.json({ message: geminiResponse.response.text() }, { status: 200 });
}

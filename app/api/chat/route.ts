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
    console.log('RESPONSE:', geminiResponse.response.text());

    return Response.json({ message: geminiResponse.response.text() }, { status: 200 });
}

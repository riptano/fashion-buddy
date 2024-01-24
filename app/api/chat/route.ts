import { AstraDB } from '@datastax/astra-db-ts';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';
import fs from 'fs';


const { 
    ASTRA_DB_APPLICATION_TOKEN, 
    ASTRA_DB_ENDPOINT, 
    GOOGLE_API_KEY,
} = process.env;

// Connect to Astra
const db = new AstraDB(ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT);

// Connect to Google GenAI
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY || '');
const gemini_model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(path: fs.PathOrFileDescriptor, mimeType: string) {
    const part = {
        inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType
        },
    };
    return part;
}

export async function POST(req: Request) {
    // Extract the `prompt` from the body of the request
    const { messages, data } = await req.json();

    const currentMessage = messages[messages.length - 1];
    const prompt = currentMessage.content;
    const image = fileToGenerativePart("app/sample_outfit.jpeg", "image/jpeg");
    const textPart = {text: prompt};
    const request = {
        contents: [{role: 'user', parts: [textPart, image]}],
    };
    
    const geminiStream = await gemini_model.generateContentStream(request);

    // Convert the response into a friendly text-stream
    const stream = GoogleGenerativeAIStream(geminiStream);
    // Respond with the stream
    return new StreamingTextResponse(stream);
}

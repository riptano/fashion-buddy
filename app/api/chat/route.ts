import { AstraDB } from "@datastax/astra-db-ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai";
import fs from "fs";

// 
const { ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT, GOOGLE_API_KEY } =
  process.env;

// Connect to Astra
const db = new AstraDB(ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT);

// Connect to Google GenAI
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY || "");
const gemini_model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });


function fileToGenerativePart(path: fs.PathOrFileDescriptor, mimeType: string) {
  const part = {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
  return part;
}

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages, data } = await req.json();

  const currentMessage = messages[messages.length - 1];

  // Prompt that gets sent to the model
  const prompt = currentMessage.content;
  console.log(prompt);
  const textPart = { text: prompt };

  // fileToGenerativePart(image, image_type)
  // const image = fileToGenerativePart("app/sample_outfit.jpeg", "image/jpeg");

  // Image part that gets sent to the model
  const imagePart = {
    inlineData: {
      data: data.imageUrl,
      mimeType: "image/jpeg",
    },
  };

  const request = {
    contents: [{ role: "user", parts: [textPart, imagePart] }],
  };

  const geminiStream = await gemini_model.generateContentStream(request);

  // Convert the response into a friendly text-stream
  const stream = GoogleGenerativeAIStream(geminiStream);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}

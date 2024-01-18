import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import {AstraDB} from "@datastax/astra-db-ts";


const {
  ASTRA_DB_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  OPENAI_API_KEY,
} = process.env;

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';
 
export async function POST(req: Request) {
  // 'data' contains the additional data that you have sent:
  const { messages, data } = await req.json();
 
  const initialMessages = messages.slice(0, -1);
  const currentMessage = messages[messages.length - 1];
 
  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    stream: true,
    max_tokens: 150,
    messages: [
      ...initialMessages,
      {
        ...currentMessage,
        content: [
          { type: 'text', text: currentMessage.content },
 
          // forward the image information to OpenAI:
          {
            type: 'image_url',
            image_url: data.imageUrl,
          },
        ],
      },
    ],
  });
  

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}

// //Import necessary modules
// // import fs from "fs";
// import path from "path";
// // import { GoogleVertexAIMultimodalEmbeddings } from "langchain/experimental/multimodal_embeddings/googlevertexai";
// // import { FaissStore } from "langchain/vectorstores/faiss";
// // import { Document } from "langchain/document";
// import OpenAI from "openai";
// import { OpenAIStream, StreamingTextResponse } from "ai";
// import { AstraDB } from "@datastax/astra-db-ts";

// const {
//   ASTRA_DB_ENDPOINT,
//   ASTRA_DB_APPLICATION_TOKEN,
//   ASTRA_DB_NAMESPACE,
//   ASTRA_DB_COLLECTION,
//   COHERE_API_KEY,
//   OPENAI_API_KEY,
// } = process.env;

// //Initialize GoogleVertexAIMultimodalEmbeddings and OpenAI
// //const vertexEmbed = new GoogleVertexAIMultimodalEmbeddings();

// const openai = new OpenAI({
//   apiKey: OPENAI_API_KEY,
//   baseURL: "https://open-assistant-ai.astra.datastax.com/v1",
//   defaultHeaders: {
//     "astra-api-token": ASTRA_DB_APPLICATION_TOKEN,
//   },
// });

// export const runtime = "edge";

// // Establish connection with Astra DB
// const astraDb = new AstraDB(ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT);

// Set example image
// const exampleImage = fs.readFileSync("app/assets/example-outfit.jpeg");

// // generate image embedding
// const generateImageEmbedding = async (img) => {
//   console.log("Generating image embeddings");
//   const embeddedImage = await vertexEmbed.embedImageQuery(img);
//   return embeddedImage;
// };


// const findSimilarItems = async (img) => {
//   try {
//     const collection = await astraDb.collection(ASTRA_DB_COLLECTION);
//     const embedding = await vertexEmbed.embedImageQuery(img);
//     const cursor = collection.find(null, {
//       sort: {
//         $vector: embedding,
//       },
//       limit: 3,
//     }).toArray().then(docs => {docs.forEach(doc => console.log(doc))});

//   } catch (e) {
//     console.log("Error querying db...");
//   }
// };

// findSimilarItems(exampleImage)

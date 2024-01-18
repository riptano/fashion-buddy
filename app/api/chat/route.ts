import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { AstraDB } from "@datastax/astra-db-ts";
import { GoogleVertexAIMultimodalEmbeddings } from "langchain/experimental/multimodal_embeddings/googlevertexai";

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
  // Not working for some reason
  // baseURL: "https://open-assistant-ai.astra.datastax.com/v1",
  // defaultHeaders: {
  //   "astra-api-token": ASTRA_DB_APPLICATION_TOKEN,
  // }
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

// Establish connection with database
// const astraDb = new AstraDB(ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT);

export async function POST(req: Request) {
  // 'data' contains the additional data that you have sent:
  const { messages, data } = await req.json();

  // Initialize GoogleVertexAIMultimodalEmbeddings and OpenAI
  // const vertexEmbed = new GoogleVertexAIMultimodalEmbeddings();

  // Query the DB
  /*
  try {
    const collection = await astraDb.collection(ASTRA_DB_COLLECTION);
    const embedding = await vertexEmbed.embedImageQuery(data.imageUrl);
    const cursor = collection
      .find(null, {
        sort: {
          $vector: embedding,
        },
        limit: 3,
      })
      .toArray()
      .then((docs) => {
        docs.forEach((doc) => console.log(doc));
      });
  } catch (e) {
    console.log("Error querying db...");
  }
  */

  const initialMessages = messages.slice(0, -1);
  const currentMessage = messages[messages.length - 1];

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    stream: true,
    max_tokens: 150,
    messages: [
      ...initialMessages,
      {
        ...currentMessage,
        content: [
          { type: "text", text: currentMessage.content },

          // forward the image information to OpenAI:
          {
            type: "image_url",
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

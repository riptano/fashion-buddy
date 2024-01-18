console.log("Is this working?")


const {VertexAI} = require('@google-cloud/vertexai');


/*
TODO: Must run `gcloud auth application-default login` in local terminal before running
*/
  async function createNonStreamingMultipartContent(
    projectId = 'decent-bird-389019',
    location = 'us-central1',
    model = 'gemini-pro-vision',
    image = 'gs://generativeai-downloads/images/scones.jpg',
    mimeType = 'image/jpeg'
  ) {
    // Initialize Vertex with your Cloud project and location
    const vertexAI = new VertexAI({project: projectId, location: location});

    // Instantiate the model
    const generativeVisionModel = vertexAI.preview.getGenerativeModel({
      model: model,
    });

    // For images, the SDK supports both Google Cloud Storage URI and base64 strings
    const filePart = {
      fileData: {
        fileUri: image,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: 'what is shown in this image?',
    };

    const request = {
      contents: [{role: 'user', parts: [filePart, textPart]}],
    };

    console.log('Prompt Text:');
    console.log(request.contents[0].parts[0].text);

    console.log('Non-Streaming Response Text:');
    // Create the response stream
    const responseStream =
      await generativeVisionModel.generateContentStream(request);

    // Wait for the response stream to complete
    const aggregatedResponse = await responseStream.response;

    // Select the text from the response
    const fullTextResponse =
      aggregatedResponse.candidates[0].content.parts[0].text;

    console.log(fullTextResponse);
  }

  createNonStreamingMultipartContent()

  //Import necessary modules
import fs from "fs";
import path from "path";
import { GoogleVertexAIMultimodalEmbeddings } from "langchain/experimental/multimodal_embeddings/googlevertexai";
import { FaissStore } from "langchain/vectorstores/faiss";
import { Document } from "langchain/document";
import { CohereClient } from "cohere-ai";
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { AstraDB } from "@datastax/astra-db-ts";

const {
  ASTRA_DB_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  COHERE_API_KEY,
  OPENAI_API_KEY,
} = process.env;

//Initialize GoogleVertexAIMultimodalEmbeddings and OpenAI
const vertexEmbed = new GoogleVertexAIMultimodalEmbeddings();

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: "https://open-assistant-ai.astra.datastax.com/v1",
  defaultHeaders: {
    "astra-api-token": ASTRA_DB_APPLICATION_TOKEN,
  },
});

// Establish connection with Astra DB
const astraDb = new AstraDB(ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT);

// Set example image
const exampleImage = fs.readFileSync("app/assets/example-outfit.jpeg");

// // generate image embedding
// const generateImageEmbedding = async (img) => {
//   console.log("Generating image embeddings");
//   const embeddedImage = await vertexEmbed.embedImageQuery(img);
//   return embeddedImage;
// };

export async function POST(req: Request) {
  console.log("Request received")
}

export const findSimilarItems = async (img) => {
  try {
    const collection = await astraDb.collection(ASTRA_DB_COLLECTION);
    const embedding = await vertexEmbed.embedImageQuery(img);
    const cursor = collection.find(null, {
      sort: {
        $vector: embedding,
      },
      limit: 10,
    }).toArray().then(docs => {docs.forEach(doc => console.log(doc))});

    
  } catch (e) {
    console.log("Error querying db...");
  }
}; 

findSimilarItems(exampleImage)

import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { EnhancedProduct } from "@/utils/types";
import { unzipAndReadCSVs } from "./combineCSVs";
import { AstraDB } from "@datastax/astra-db-ts";
import 'dotenv/config'
import { HumanMessage } from "@langchain/core/messages";


const { ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT, GOOGLE_API_KEY } =
  process.env;

const astraDB = new AstraDB(ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT);

const loadData = async () => {
  const products = await unzipAndReadCSVs('scripts/archive.zip');

  const gemini_model = new ChatGoogleGenerativeAI({
    apiKey: GOOGLE_API_KEY,
    modelName: "gemini-pro-vision",
    streaming: false,
  });

  const embeddings_model = new GoogleGenerativeAIEmbeddings({
    apiKey: GOOGLE_API_KEY,
    modelName: "embedding-001",
});

  const descriptionChain = RunnableSequence.from([
    gemini_model,
    new StringOutputParser(),
  ]);

  await astraDB.createCollection("fashion_buddy", {
    vector: {
      dimension: 768,
      metric: "cosine",
    }
  });
  const collection = await astraDB.collection("fashion_buddy");

  for (const product of products) {
    let imageBase64 = '';
    try {
      imageBase64 = await convertImageToBase64(product.product_images);
    } catch (error) {
      console.error(`Error converting image ${product.product_images}`);
      continue;
    }
    if (!imageBase64) {
      console.error(`Error converting image for product: ${product.product_name} to base64`);
      console.log(product.product_images)
      continue;
    }
    const message = [
      new HumanMessage({
          content: [
              {
                  type: "text",
                  text: `Give a short description of the product following product in the image provided
                  Product Name: ${product.product_name}
                  Product Category: ${product.category}`,
              },
              {
                  type: "image_url",
                  image_url: `data:image/jpeg;base64,${imageBase64}`,
              },
          ]
      })
  ];
    const gemini_description = await descriptionChain.invoke(message);
    const embedding = await embeddings_model.embedQuery(gemini_description);
    await collection.insertOne({
      ...product,
      gemini_description,
      $vector: embedding,
    })

    console.log(`Inserted product: ${product.product_name}`)
  }
}

const convertImageToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    return base64Image;
  } catch (error) {
    console.error('Error fetching or converting image:', url, error);
    throw error;
  }
}

loadData();
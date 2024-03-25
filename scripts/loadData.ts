import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { OriginalProduct } from "@/utils/types";
import { unzipAndReadCSVs } from "./combineCSVs";
import { AstraDB, Collection } from "@datastax/astra-db-ts";
import 'dotenv/config'

const { ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT, GOOGLE_API_KEY } =
  process.env;

const astraDB = new AstraDB(ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT);

const prompt = PromptTemplate.fromTemplate(`Idenity the following product in the image provided.
Product Name: {name}
Product Category: {category}
Product Description: {description}

Return an enhanced description of the product based on the image for better search results.
Do not include any specific details that can not be confirmed from the image or provided description such as the quality of materials, other color options, or exact measurements.
`);

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

  let insertCount = 0;
  let failCount = 0;

  const results = await loadWithConcurrency(
    products,
    10,
    collection,
    descriptionChain,
    embeddings_model
  );

  results.forEach(result => {
    if (result.success) {
      insertCount++;
    } else {
      failCount++;
    }
  });

  console.log(`Collection load complete. Inserted: ${insertCount}, Failed: ${failCount}`);
}

const loadWithConcurrency = async (
  products: OriginalProduct[],
  limit: number,
  collection: Collection,
  descriptionChain: RunnableSequence,
  embeddings_model: GoogleGenerativeAIEmbeddings
) => {
  let active = [];
  let results = [];

  for (const product of products) {
    const promise = processProduct(
      product,
      collection,
      descriptionChain,
      embeddings_model
    ).then(result => {
      // Remove the promise from the active array when it resolves
      active = active.filter(p => p !== promise);
      return result;
    });
    active.push(promise);

    // If we've reached the concurrency limit, wait for one promise to finish
    if (active.length >= limit) {
      await Promise.race(active);
    }

    results.push(promise);
  }

  return Promise.all(results);
} 

const processProduct = async (
  product: OriginalProduct,
  collection: Collection,
  descriptionChain: RunnableSequence,
  embeddings_model: GoogleGenerativeAIEmbeddings
) => {
  let imageBase64 = '';
  try {
    imageBase64 = await convertImageToBase64(product.product_images);
  } catch (error) {
    console.error(`Error converting image ${product.product_images}`);
    return { success: false };
  }
  if (!imageBase64) {
    console.error(`Error converting image for product: ${product.product_name} to base64`);
    console.log(product.product_images)
    return { success: false };
  }
  const message = [
    new HumanMessage({
        content: [
            {
                type: "text",
                text: await prompt.format({
                  name: product.product_name,
                  category: product.category,
                  description: product.details,
                }),
            },
            {
                type: "image_url",
                image_url: `data:image/jpeg;base64,${imageBase64}`,
            },
        ]
    })
  ];
  try {
    const gemini_description = await descriptionChain.invoke(message);
    const embedding = await embeddings_model.embedQuery(gemini_description);
    await collection.insertOne({
      ...product,
      gemini_description,
      $vector: embedding,
    })

    console.log(`Inserted product: ${product.product_name}`)
    return { success: true };
  } catch (error) {
    console.error(`Error inserting product: ${product.product_name}`, error);
    return { success: false };
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
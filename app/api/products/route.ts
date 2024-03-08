import { Document } from "@langchain/core/documents";
import { HumanMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GoogleVertexAIMultimodalEmbeddings } from "langchain/experimental/multimodal_embeddings/googlevertexai";
import { NextResponse } from "next/server";
import { 
    RunnableLambda,
    RunnableSequence
  } from "@langchain/core/runnables";
import { Filters, ProductType } from "@/utils/types";
import {
    AstraDBVectorStore,
    AstraLibArgs,
  } from "@langchain/community/vectorstores/astradb";


// Environment variables
const { ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT, GOOGLE_API_KEY } =
  process.env;

const PROMPT = 'describe the clothing items worn in this photo';

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Initialize chat and embeddings models
        const gemini_model = new ChatGoogleGenerativeAI({
            apiKey: GOOGLE_API_KEY,
            modelName: "gemini-pro-vision",
            streaming: false,
        })

        const vertex = new GoogleVertexAIMultimodalEmbeddings();
        
        const embeddings_model = new GoogleGenerativeAIEmbeddings({
            apiKey: GOOGLE_API_KEY,
            modelName: "embedding-001",
        });


        // Create astra config and initailize vector store
        const astraConfig: AstraLibArgs = {
            token: ASTRA_DB_APPLICATION_TOKEN,
            endpoint: ASTRA_DB_ENDPOINT,
            collection: "shopping_buddy_demo",
            collectionOptions: {
                vector: {
                    dimension: 1408,
                    metric: "cosine",
                }
            },
            contentKey: "details",
        };

        const astra = new AstraDBVectorStore(embeddings_model, astraConfig);
        await astra.initialize();

        // Create our retriever chain
        const astraRetrieverChain = RunnableSequence.from([
            RunnableLambda.from(
                (input: string) => embeddings_model.embedQuery(input),
            ).withConfig({ runName: "GetEmbedding" }),
            RunnableLambda.from(
                (input: number[]) => astra.similaritySearchVectorWithScore(input, 10, getFilters(data.filters))
            ).withConfig({ runName: "GetProductsFromAstra" }),
            RunnableLambda.from(
                (input: [Document, number][]) => mapDocsToProducts(input)
            ).withConfig({ runName: "MapDocsToProducts" }),
        ]).withConfig({ runName: "AstraRetrieverChain" });

        const astraVertexChain = RunnableSequence.from([
            RunnableLambda.from(
                (input: string) => vertex.embedImageQuery(input)
            ).withConfig({ runName: "GetEmbedding" }),
            RunnableLambda.from(
                (input: number[]) => astra.similaritySearchVectorWithScore(input, 10, getFilters(data.filters))
            ).withConfig({ runName: "GetProductsFromAstra" }),
            RunnableLambda.from(
                (input: [Document, number][]) => mapDocsToProducts(input)
            ).withConfig({ runName: "MapDocsToProducts" }),
        ]).withConfig({ runName: "AstraVertexChain" });

        // Create our core chain
        const chain = RunnableSequence.from([
            gemini_model,
            new StringOutputParser(),
            astraRetrieverChain,
        ])

        // Creates the initial message containing the image and prompt
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

        vertex.embedImageQuery

        const base64Data = data.imageBase64.split(';base64,').pop(); // Extract Base64 encoded data

        const imageBuffer = Buffer.from(base64Data, 'base64');  

        const vertexChain = RunnableSequence.from([
            RunnableLambda.from(
                (input: Buffer) => vertex.embedImageQuery(input),
            ).withConfig({ runName: "GetEmbedding" }),
            RunnableLambda.from(
                (input: number[]) => astra.similaritySearchVectorWithScore(input, 10, getFilters(data.filters))
            ).withConfig({ runName: "GetProductsFromAstra" }),
            RunnableLambda.from(
                (input: [Document, number][]) => mapDocsToProducts(input)
            ).withConfig({ runName: "MapDocsToProducts" }),
        ]).withConfig({ runName: "VertexAstraRetrieverChain" });

        // Invoke the chain using the multi-modal message
        // const products = await chain.invoke(message);   

        const products = await vertexChain.invoke(imageBuffer);

        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

const mapDocsToProducts = (docs: [Document, number][]): ProductType[] => {
    return docs.map(doc => {
        const { $vector, ...cleanMetadata } = doc[0].metadata;
        return {
            ...cleanMetadata,
            details: doc[0].pageContent,
            $similarity: doc[1],
        } as ProductType;
    });
}


// Create a filter object
const getFilters = (filters: Filters): Record<string, any> => {
    let filter = {};
    let categoryFilter;
    let genderFilter;

    if (filters.categories.length > 0) {
        categoryFilter = {
            $or: filters.categories.map(category => ({ category: category }))
        };
    }
    
    if (filters.gender.length && filters.gender[0] !== "all") {
        genderFilter = { gender: filters.gender[0] };
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

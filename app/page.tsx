"use client";
import { useState } from "react";

export default function Home() {
  const [uploadedImage, setImage] = useState(null);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(URL.createObjectURL(i));
    }
  };

  return (
    <div>
      <input type="file" onChange={onImageChange} />
      <img alt="preview image" src={uploadedImage} />
    </div>
  
  const {VertexAI} = require('@google-cloud/vertexai');
  /**
 * TODO(developer): Update these variables before running the sample.
 */
async function createNonStreamingMultipartContent(
  projectId = 'decent-bird-389019',
  location = 'us-central1',
  model = 'gemini-pro-vision',
  image = uploadedImage,
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
  console.log('what is shown in this image?');

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
}}


);




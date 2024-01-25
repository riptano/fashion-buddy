"use client";

import { useCompletion } from "ai/react";
import { useState } from "react";

function processBase64Data(data) {
  const modifiedData = data.replace("data:image/jpeg;base64,", "");
  return modifiedData;
}

export default function Chat() {
  const {completion, complete} = useCompletion({
    api: '/api/chat'
  });
  const [uploadedImage, setImage] = useState('');
  const [processedData, setProcessedData] = useState('');
  const [prompt, setPrompt] = useState("describe the sweater in this photo");

  const onImageChange = (event) => {
    const file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function () {
      var base64data = reader.result;
      const processedData = processBase64Data(base64data);
      setProcessedData(processedData);
    };
    reader.readAsDataURL(file);
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(URL.createObjectURL(i));
    }
  };

  async function handleClick() {
    console.log('handleClick called');
      const requestoptions = {
        body: {
          imageBase64: processedData
        }
      };
      const response = await complete(prompt, requestoptions);
      if (!response) throw new Error("Completion not fetched");
      console.log("RESPONSE HERE", response);
    }

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <input type="file" onChange={onImageChange} />
      <img src={uploadedImage} />
      <p>prompt: {prompt}</p>
      <p>response: {completion}</p>

      <form>
        <button onClick={() => handleClick()} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700">Submit</button>
      </form>
    </div>
  );
}

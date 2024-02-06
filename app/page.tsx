"use client";

import ResultsContainer from "@/components/ResultsContainer";
import { useState } from "react";

function processBase64Data(data) {
  const modifiedData = data.replace("data:image/jpeg;base64,", "");
  return modifiedData;
}

export default function Chat() {
  const [uploadedImage, setImage] = useState('');
  const [processedData, setProcessedData] = useState('');
  const [prompt, setPrompt] = useState("describe the sweater in this photo");
  const [items, setItems] = useState([]);

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

  const getProducts = async () => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: processedData,
          prompt
        }),
      });

      const data = await response.json();
      console.log(data);

      const items = data.products;
      console.log(items);
      setItems(items);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main>
      <div className="flex flex-col items-center w-full overflow-y-auto">
        <h1>Fashion Buddy</h1>
        <input type="file" onChange={onImageChange} />
        <img src={uploadedImage} />
        <p>prompt: {prompt}</p>
        {/* <p>response: {completion}</p> */}

        {/* <form> */}
          <button onClick={getProducts} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700">Submit</button>
        {/* </form> */}
        
        {items && <ResultsContainer items={items} />}
      </div>
    </main>
  );
}

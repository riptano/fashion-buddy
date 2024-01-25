"use client";

import { useChat } from "ai/react";
import { useState } from "react";

function processBase64Data(data) {
  const modifiedData = data.replace("data:image/jpeg;base64,", "");
  return modifiedData;
}

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [uploadedImage, setImage] = useState(null);
  const [processedData, setProcessedData] = useState(null);

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

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <input type="file" onChange={onImageChange} />
      <p>Sample Image</p>
      <img src={uploadedImage} />
      {messages.length > 0
        ? messages.map((m) => (
            <div key={m.id} className="whitespace-pre-wrap">
              {m.role === "user" ? "User: " : "AI: "}
              {m.content}
            </div>
          ))
        : null}

      <form
        onSubmit={(e) => {
          handleSubmit(e, {
            data: {
              imageBase64: processedData,
            },
          });
        }}
      >
        
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Ask a question about this image"
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}

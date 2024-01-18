// "use client";
// import { useState } from "react";

'use client';

import { useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  // image URL now >> change this to image upload
  const imageUrl =
    "https://i.pinimg.com/564x/47/18/81/4718815109cd59904c109b734c27ed4a.jpg";

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <img alt="preview image" src={imageUrl} />
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
              imageUrl: imageUrl,
            },
          });
        }}
      >
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Ask a question about the image..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}

// export default function Home() {
//   const [uploadedImage, setImage] = useState(null);

//   const onImageChange = (event) => {
//     if (event.target.files && event.target.files[0]) {
//       const i = event.target.files[0];
//       setImage(URL.createObjectURL(i));
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={onImageChange} />
//       <img alt="preview image" src={uploadedImage} />
//     </div>
//   );

// }

"use client";

import { useState } from "react";
import { useChat } from "ai/react";
import Checkbox from './checkbox';

export default function FashionBuddy() {
  const [uploadedImage, setImage] = useState(null);
  const [processedData, setProcessedData] = useState(null);

  const { messages, setMessages, input, append, handleInputChange, handleSubmit: handleChatSubmit } = useChat();
  const [categories, setCategories] = useState({
    TOPS: false,
    DRESSES_JUMPSUITS: false,
    OUTERWEAR: false,
    BOTTOMS: false,
    ACCESSORIES: false,
    ACTIVEWEAR: false,
    SHOES: false
  });
  const [selectedGender, setSelectedGender] = useState("All");

  function processBase64Data(data) {
    const modifiedData = data.replace("data:image/jpeg;base64,", "");
    return modifiedData;
  }


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

  const handleCheckboxChange = (category) => {
    setCategories(prevFilters => ({
      ...prevFilters,
      [category]: !prevFilters[category]
    }));
  };

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Convert the selected categories to a string
    const selectedCategories = Object.entries(categories)
      .filter(([_, isSelected]) => isSelected)
      .map(([category]) => category)
      .join(', ');
  
    // Hardcode the message prompt and id
    const hardcodedPrompt = "What's in this photo?";
    const newMessageId = "4"; // Ensure this ID is unique
  

  
    // Submit payload to data
    handleChatSubmit(e, {
      data: {
        imageUrl: uploadedImage,
        category: selectedCategories,
        gender: selectedGender,
        imageBase64: processedData,
      },
    });
    // Append the hardcoded message using useChat's append function
    append({ id: newMessageId, role: 'user', content: hardcodedPrompt });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col min-h-screen">
        <h1 className="text-4xl font-bold text-center my-6">Fashion Buddy!</h1>
        <div className="flex">
          <div className="flex-grow">
            <h2 className="text-xl font-bold mb-3">Clothing Filters:</h2>
            <div className="grid grid-cols-1 gap-2 mb-4">
              {Object.keys(categories).map((category, idx) => (
                <Checkbox
                  key={idx}
                  label={category.replace('_', ' ')}
                  checked={categories[category]}
                  onChange={() => handleCheckboxChange(category)}
                />
              ))}
            </div>

            <h2 className="text-xl font-bold mb-3">Choose your Gender:</h2>
            <form className="flex flex-col items-start mb-4" onSubmit={handleSubmit}>
              {["All", "Women", "Men"].map(gender => (
                <label key={gender} className="inline-flex items-center mb-1">
                  <input 
                    type='radio' 
                    name="Gender" 
                    value={gender} 
                    checked={selectedGender === gender}
                    onChange={handleGenderChange}
                    className="mr-2" 
                  />
                  {gender}
                </label>
              ))}

              <input 
                type="file" 
                onChange={onImageChange} 
                className="mb-4" 
              />

              {uploadedImage && (
                <img 
                  src={uploadedImage} 
                  alt="Preview" 
                  className="mb-4 max-w-xs rounded-lg" 
                />
              )}

              {messages.length > 0 ? (
                messages.map((m) => (
                  <div key={m.id} className="whitespace-pre-wrap">
                    {m.role === "user" ? "User: " : "AI: "}
                    {m.content}
                  </div>
                ))
              ) : null}
              

              <input
                className="w-full p-2 mb-8 border border-gray-300 rounded shadow-xl"
                value={input}
                placeholder="Ask a question about the image..."
                onChange= {handleInputChange}
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

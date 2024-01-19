"use client";
import { useState } from "react";
import Checkbox from './checkbox';
import {useChat} from "ai/react"

export default function Home() {
  
  const [uploadedImage, setImage] = useState(null);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const [categories, setCategories] = useState({
    TOPS: false,
    DRESSES_JUMPSUITS: false,
    OUTERWEAR: false,
    BOTTOMS: false,
    ACCESSORIES: false,
    ACTIVEWEAR: false,
    SHOES: false
  });

  const handleCheckboxChange = (category) => {
    setCategories(prevFilters => ({
      ...prevFilters,
      [category]: !prevFilters[category]
    }));
  };

  const handleSubmit = () => {
    const selectedCategories = Object.entries(categories)
      .filter(([_, isSelected]) => isSelected)
      .map(([category]) => category);
    console.log("Selected Categories", selectedCategories);
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
            <form className="flex flex-col items-start mb-4">
              <label className="inline-flex items-center mb-1">
                <input type='radio' name="Gender" value="All" defaultChecked className="mr-2" />
                All
              </label>
              <label className="inline-flex items-center mb-1">
                <input type='radio' name="Gender" value="Women" className="mr-2" />
                Women
              </label>
              <label className="inline-flex items-center mb-1">
                <input type='radio' name="Gender" value="Men" className="mr-2" />
                Men
              </label>
            </form>
            
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

          </div>

          <div className="flex-grow"></div>
        </div>

        <div className="flex flex-col items-center mb-6">
          <button 
            onClick={handleSubmit} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

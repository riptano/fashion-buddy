"use client";
import {useEffect, useRef} from 'react';
import { Message } from 'ai';
import Checkbox from './checkbox'
import { useState } from "react";

export default function Home() {
  const [uploadedImage, setImage] = useState(null);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(URL.createObjectURL(i));
    }
  };

  //Create clothing categories:
  const [categories, setCategories] = useState({
    TOPS: false,
    DRESSES_JUMPSUITS: false,
    OUTERWEAR: false,
    BOTTOMS: false,
    ACCESSORIES: false,
    ACTIVEWEAR: false,
    SHOES: false
  });

  //When the checkbox is clicked, change the type
  const handleCheckboxChange = (category) => {
    setCategories(prevFilters => ({
      ...prevFilters,
      [category]: !prevFilters[category]
    }));
  };

  //When submit button is clicked, print the selected categories to the console
  const handleSubmit = () => {
    const selectedCategories = Object.entries(categories)
      .filter(([category, isSelected]) => isSelected)
      .map(([category]) => category);
      console.log("Selected Categories", selectedCategories)
    
  };

  return (
    <div className='checkboxes' >
      <input type="file" onChange={onImageChange} />
      <img alt="preview image" src={uploadedImage} />


      <h1>Clothing Filters:</h1>
      <Checkbox 
            label="Tops" 
            checked={categories.TOPS} 
            onChange={() => handleCheckboxChange('TOPS')}
      />
      <Checkbox 
            label="Dresses/Jumpsuits" 
            checked={categories.DRESSES_JUMPSUITS} 
            onChange={() => handleCheckboxChange('DRESSES_JUMPSUITS')}
      />
      <Checkbox 
            label="Outerwear" 
            checked={categories.OUTERWEAR} 
            onChange={() => handleCheckboxChange('OUTERWEAR')}
      />
      <Checkbox 
            label="Bottoms" 
            checked={categories.BOTTOMS} 
            onChange={() => handleCheckboxChange('BOTTOMS')}
      />
      <Checkbox 
            label="Accessories" 
            checked={categories.ACCESSORIES} 
            onChange={() => handleCheckboxChange('ACCESSORIES')}
      />
      <Checkbox 
            label="Activewear" 
            checked={categories.ACTIVEWEAR} 
            onChange={() => handleCheckboxChange('ACTIVEWEAR')}
      />
      <Checkbox 
            label="Shoes" 
            checked={categories.SHOES} 
            onChange={() => handleCheckboxChange('SHOES')}
      />
      
      <button onClick={handleSubmit}>Submit</button> 
      
    </div>
    
  )
}
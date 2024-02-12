"use client"
import { useEffect, useState } from "react";
import { useImage, useProcessedImage } from "@/components/ImageContext";
import ResultsContainer from "@/components/ResultsContainer";

export default function RecommendedProducts() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [prompt, setPrompt] = useState("describe the sweater in this photo");
  const [image, setImage] = useImage();
  const [processedImage, setProcessedImage] = useProcessedImage();

  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: processedImage,
          prompt
        }),
      });

      const data = await response.json();
      console.log(data);

      const items = data.products;
      console.log(items);
      setItems(items);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (processedImage) {
      getProducts();
    }
  }, []);

  return (
    <div>
      {items && <ResultsContainer items={items} />}
    </div>
  )
}
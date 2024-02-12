"use client";
import React, { createContext, useState } from "react";

const useImageState = () =>
  useState<string>();

const useProcessedImageState = () =>
  useState<string>();

export const ImageContext = createContext<ReturnType<
  typeof useImageState
> | null>(null);

export const ProcessedImageContext = createContext<ReturnType<
  typeof useProcessedImageState
> | null>(null);

export const useImage = () => {
  const img = React.useContext(ImageContext);
  if (!img) {
    throw new Error("useImage must be used within a ImageProvider");
  }
  return img;
};

export const useProcessedImage = () => {
  const processed = React.useContext(ProcessedImageContext);
  if (!processed) {
    throw new Error("useProcessedImage must be used within a ProcessedImageProvider");
  }
  return processed;
};

const ImageProvider = ({ children }: { children: React.ReactNode }) => {
  const [image, setImage] = useImageState();
  const [processedImage, setProcessedImage] = useProcessedImageState();

  return (
    <ImageContext.Provider value={[image, setImage]}>
      <ProcessedImageContext.Provider value={[processedImage, setProcessedImage]}>
        {children}
      </ProcessedImageContext.Provider>
    </ImageContext.Provider>
  );
};

export default ImageProvider;
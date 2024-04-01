"use client";
import { useRef } from "react";
import {
  ArrowRepeat,
  X,
  Camera,
  FileEarmark,
  Stars,
  Upload,
} from "react-bootstrap-icons";
import { useImage, useProcessedImage } from "@/components/ImageContext";
import Image from "next/image";

interface UploadPhotoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadPhotoDialog({
  isOpen,
  onClose,
}: UploadPhotoDialogProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useImage();
  const [, setProcessedImage] = useProcessedImage();

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (!file) {
      return;
    }

    var reader = new FileReader();
    reader.onload = function () {
      var base64Data = reader.result as string;
      setProcessedImage({
        base64Data,
        fileType: file.type,
      });
    };
    reader.readAsDataURL(file);
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(URL.createObjectURL(i));
    }
  };

  const handleUploadClick = () => {
    if (uploadInputRef.current) {
      uploadInputRef.current.click();
    }
  };

  const handleTakePhotoClick = () => {
    if (photoInputRef.current) {
      photoInputRef.current.click();
    }
  };

  const handleRefreshClick = () => {
    setImage("");
    setProcessedImage({
      base64Data: "",
      fileType: "",
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black opacity-75"
        onClick={onClose}
      ></div>

      {/* Modal content container */}
      <div className="tan-background rounded-[50px] p-6 z-10 w-full max-w-2xl">
        {/* Header section */}
        <div className="flex justify-between items-center mt-2 mx-2">
          {/* Modal title */}
          <h2 className="text-xl font-semibold">Search by image</h2>
          {/* Close button */}
          <button
            className="text-black hover:text-gray-700 focus:outline-none"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        {/* Main content section */}
        {image ? (
          <div className="h-[474px] flex flex-col justify-center items-center">
            <div className="h-full w-full flex items-center justify-center p-4">
              <Image
                className="rounded-lg object-contain"
                src={image}
                alt="user image"
                width={300}
                height={474}
              />
            </div>
          </div>
        ) : (
          <div className="h-[474px] flex flex-col justify-center items-center">
            {/* Image section */}
            <div className="flex justify-center items-center gap-4 opacity-10">
              {/* Camera icon */}
              <Camera size={48} />
              {/* Separator line */}
              <svg
                width="35"
                height="121"
                viewBox="0 0 35 121"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 120.5L33.5 0.5"
                  stroke="#090909"
                  strokeWidth="3"
                />
              </svg>
              {/* File icon */}
              <FileEarmark size={48} />
            </div>

            {/* Text section */}
            <div className="text-center pt-6">
              <p>Add a photo of the style you love.</p>
              <p>We&apos;ll help you add it to your wardrobe.</p>
            </div>
          </div>
        )}

        {/* Button section */}
        <div className="flex items-center justify-center py-3">
          {/* Upload button */}
          <input
            className="hidden"
            id="uploadInput"
            accept="image/*"
            ref={uploadInputRef}
            type="file"
            onChange={onImageChange}
          />
          <label htmlFor="uploadInput">
            <button
              className="flex items-center justify-center rounded-full w-80 font-medium text-white bg-black p-3 text-lg leading-snug tracking-tight"
              onClick={handleUploadClick}
              type="button"
            >
              {/* Upload icon */}
              <Upload className="mr-2" />
              Upload Photo
            </button>
          </label>
          {/* Separator line */}
        </div>
      </div>
    </div>
  );
}

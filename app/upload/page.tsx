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
import Link from "next/link";

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
      {/* Overlay wrapper */}

      <div
        className="fixed inset-0 bg-black opacity-75"
        onClick={onClose}
      ></div>
      {/* Background overlay */}

      <div className="tan-background md:rounded-[50px] p-6 z-10 w-screen h-screen md:h-[658px] sm:max-w-2xl flex flex-col justify-between">
        {/* Modal container */}

        <div className="flex justify-between items-center mt-2 mx-2">
          {/* Header section */}

          <h2 className="text-xl font-semibold">Search by image</h2>
          {/* Modal title */}

          <button
            className="text-black hover:text-gray-700 focus:outline-none"
            onClick={onClose}
          >
            <X size={24} />
          </button>
          {/* Close button */}
        </div>

        {image ? (
          <div className="flex flex-col justify-center w-full h-full items-center">
            {/* Image display */}

            <div className="relative flex items-center w-full h-full justify-center ">
              <Image
                className="sm:p-6"
                src={image}
                alt="user image"
                layout="fill"
                objectFit="contain"
              />
              {/* User image */}
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-full">
            {/* Upload prompt */}

            <div className="flex justify-center items-center gap-4 opacity-10">
              <Camera size={48} />
              {/* Camera icon */}

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
              {/* Separator line */}

              <FileEarmark size={48} />
              {/* File icon */}
            </div>

            <div className="text-center pt-6">
              {/* Text section */}

              <p>Add a photo of the style you love.</p>
              {/* Instruction text */}

              <p>We&apos;ll help you add it to your wardrobe.</p>
              {/* Additional info */}
            </div>
          </div>
        )}

        <div className="flex items-center justify-center pb-3">
          {/* Button section */}

          {!image ? (
            <>
              <input
                className="hidden"
                id="uploadInput"
                accept="image/*"
                ref={uploadInputRef}
                type="file"
                onChange={onImageChange}
              />
              {/* File input */}

              <label htmlFor="uploadInput">
                <button
                  className="flex items-center justify-center rounded-full w-80 font-medium text-white bg-black p-3 text-lg leading-snug tracking-tight"
                  onClick={handleUploadClick}
                  type="button"
                >
                  <Upload className="mr-2" />
                  {/* Upload button */}
                  Upload Photo
                </button>
              </label>
            </>
          ) : (
            <div className="flex gap-4">
              {/* Action buttons */}

              <Link className="grow" href="/recommended-products">
                <button
                  className="flex items-center justify-center rounded-full w-80 font-medium text-black slime-background p-3 text-lg leading-snug tracking-tight"
                  onClick={handleUploadClick}
                  type="button"
                >
                  <Stars className="mr-2" />
                  {/* Recommend button */}
                  Recommend products
                </button>
              </Link>
              <button
                className="dark-background flex items-center justify-center rounded-full px-5"
                onClick={handleRefreshClick}
              >
                <ArrowRepeat />
                {/* Refresh button */}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

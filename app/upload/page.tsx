"use client";
import { useRef, } from "react";
import { ArrowRepeat, Camera, FileEarmark, Stars, Upload } from "react-bootstrap-icons";
import Link from "next/link";
import { useImage, useProcessedImage } from "@/components/ImageContext";
import { createReadStream } from "fs";

export default function UploadPhoto() {
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
      var base64data = reader.result as string;
      const processedData = base64data.split(",")[1];
      setProcessedImage({
        base64Data: processedData,
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
  }

  const handleRefreshClick = () => {
    setImage('');
    setProcessedImage({
      base64Data: '',
      fileType: '',
    });
  };

  return (
    <section className="tan-background h-full">
      <div className="flex flex-col items-center w-full h-full overflow-y-auto p-6">
        <div className="grow flex flex-col items-center justify-center">
          {image ? (
            <img src={image} alt='user image' />
          ) : (
            <div>
              <div className="flex justify-center items-center gap-4 mb-4 opacity-10">
                <Camera size={48} />
                <svg width="35" height="121" viewBox="0 0 35 121" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 120.5L33.5 0.5" stroke="#090909" strokeWidth="3"/>
                </svg>
                <FileEarmark size={48} />
              </div>
              <p className="text-center text-lg">Add a photo of the style you love. We&apos;ll help you add it to your wardrobe</p>
            </div>
          )}
        </div>
        <div className="w-full">
          {image ? (
            <div className="flex justify-between gap-4">
              <Link className="grow" href="/recommended-products">
                <button className="slime-background flex items-center justify-center gap-2 rounded-full w-full p-4 text-lg font-semibold" >
                  <Stars />
                    Recommended products
                </button>
              </Link>
              <button
                className="dark-background flex items-center justify-center rounded-full px-5"
                onClick={handleRefreshClick}
              >
                <ArrowRepeat />
              </button>
            </div>
          ): (
            <>
              <div className="mb-2">
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={onImageChange}
                  ref={photoInputRef}
                  id="cameraInput"
                  name="picture"
                />
                  <label htmlFor="cameraInput">
                    <button
                      className="flex items-center justify-center gap-2 w-full rounded-full p-4 text-lg font-semibold dark-background"
                      onClick={handleTakePhotoClick}
                      type="button"
                    >
                      <Camera />
                      Open Camera
                    </button>
                  </label>
                </div>
              <div>
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
                    className="flex items-center justify-center gap-2 w-full rounded-full p-4 text-lg font-semibold bg-white"
                    onClick={handleUploadClick}
                    type="button"
                  >
                    <Upload />
                    Upload Photo 
                  </button>
                </label>
              </div>   
            </>
          )}
        </div>
      </div>
    </section>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "react-bootstrap-icons";
import datastaxLogo from "../assets/datastax-logo.png";
import UploadPhotoDialog from "./upload/page";

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen cream-background">
      {/* Left side */}
      <div className="md:flex-1 md:bg-cover sm:bg-center md:flex clothing-background ">
        {/* Logo and powered by text */}
        <div className="lg:p-10 md:p-8 p-6 z-10 absolute">
          <h3 className="text-black">Powered by</h3>
          <Image
            className="mt-2"
            src={datastaxLogo}
            alt="DataStax Logo"
            height={16}
            width={172}
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex-1 flex justify-center items-center bg-cover bg-center sm:bg-cover sm:bg-center clothing-background md:bg-none">
        {/* Content container */}
        <div className="grid gap-6 grid-rows-1 place-items-start px-6">
          {/* Main heading */}
          <p className="md:text-6xl text-5xl font-bold md:text-left text-center">
            Fashion, Meet AI.
          </p>

          {/* Subheading */}
          <p className="text-xl text-center md:text-left">
            Say goodbye to wardrobe dilemmas and hello to effortless style.
          </p>

          {/* "Get started" button */}
          <button
            className="slime-background flex items-center justify-center rounded-full text-lg font-semibold mt-3 w-full px-6 py-3"
            onClick={handleOpenDialog}
          >
            Get started
            <ArrowRight className="ml-2 text-xl" />
          </button>

          {/* Upload photo dialog */}
          <UploadPhotoDialog
            isOpen={isDialogOpen}
            onClose={handleCloseDialog}
          />
        </div>
      </div>
    </div>
  );
}

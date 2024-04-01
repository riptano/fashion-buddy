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
      <div className="flex-1 bg-cover bg-center clothing-background">
        {/* Logo and powered by text */}
        <div className="p-10">
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
      <div className="flex-1 flex justify-center items-center">
        {/* Content container */}
        <div className="grid gap-6">
          {/* Main heading */}
          <p className="text-6xl font-bold">Fashion, Meet AI.</p>

          {/* Subheading */}
          <p className="text-xl max-w-xs">
            Say goodbye to wardrobe dilemmas and hello to effortless style.
          </p>

          {/* "Get started" button */}
          <button
            className="slime-background flex items-center justify-center rounded-full text-lg font-semibold mt-6 w-full max-w-sm px-6 py-3"
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

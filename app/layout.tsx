import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";
import ImageProvider from "@/components/ImageContext";

const syne = Syne({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fashion Buddy",
  description:
    "Welcome to Fashion Buddy, your daily outfit finder. Upload an image or take a photo, select which categories you want to search for, and receive similar items from your preferred retailer. ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.className}`}>
        <main>
          <ImageProvider>{children}</ImageProvider>
        </main>
      </body>
    </html>
  );
}

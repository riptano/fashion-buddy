"use client";
import { useEffect, useState } from "react";
import { useImage, useProcessedImage } from "@/components/ImageContext";
import ResultsContainer from "@/components/ResultsContainer";
import Image from "next/image";
import Link from "next/link";
import { ArrowRepeat, FilterLeft } from "react-bootstrap-icons";
import { useRouter } from "next/navigation";
import loadingGif from "@/assets/hourglass.gif";
import { Filters } from "@/utils/types";
import FilterDialog from "@/components/FilterDialog";

export default function RecommendedProducts() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState([]);
  const [image] = useImage();
  const [processedImage] = useProcessedImage();
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    gender: ["all"],
  });

  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: processedImage.base64Data,
          fileType: processedImage.fileType,
          filters,
        }),
      });

      const data = await response.json();

      const items = data.products;
      setItems(items);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (processedImage) {
      getProducts();
    } else {
      router.push("/upload");
    }
  }, []);

  return (
    <>
      <div className="cream-background h-screen">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Image src={loadingGif} alt="loading" width={80} height={80} />
          </div>
        ) : (
          <div className="flex flex-col p-6 md:p-0 h-full">
            {/* Filter Results desktop */}
            <div className="hidden md:flex z-50">
              <div className="absolute top-6 right-6 ">
                <button className="flex gap-4 items-center justify-center rounded-full cream-background px-6 py-4">
                  <Image
                    className="rounded-full"
                    src={image}
                    width={24}
                    height={24}
                    alt="user image"
                  />
                  Filter Results
                  <FilterLeft />
                </button>
              </div>
              <div className="grid grid-rows-2 grid-flow-col">
                {items.map((item) => (
                  <div key={item._id}>
                    <Image
                      src={item.product_images}
                      alt={item.product_name}
                      width={200}
                      height={200}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col h-screen md:invisible visible">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-black">
                <div className="flex items-center text-lg	">
                  <Image
                    className="rounded-full mr-3"
                    src={image}
                    width={24}
                    height={24}
                    alt="user image"
                  />
                  Results
                </div>
                <button className="flex items-center text-lg">
                  Filter <FilterLeft width={24} height={24} className="ml-3" />
                </button>
              </div>

              {/* Results Content (scrollable) */}
              <div className="flex-1 overflow-auto">
                {items && <ResultsContainer items={items} />}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center p-4 m-6">
                <button
                  className="flex items-center justify-center rounded-full w-full font-medium text-white bg-black p-3 text-lg leading-snug tracking-tight"
                  type="button"
                >
                  <ArrowRepeat className="mr-2" />
                  Choose a new outfit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* <FilterDialog
        isOpen={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={() => {
          getProducts();
          setFilterDialogOpen(false);
        }}
      /> */}
    </>
  );
}

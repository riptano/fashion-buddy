"use client"
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
    genders: [],
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
          filters
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
  }

  useEffect(() => {
    if (processedImage) {
      getProducts();
    } else {
      router.push("/upload");
    }
  }, []);

  return (
    <>
      <section className="cream-background h-full">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Image src={loadingGif} alt="loading" width={80} height={80} />
          </div>
        ) : (
          <div className="flex flex-col p-6 h-full">
            <div className="flex justify-between items-center pb-4 border-bottom">
              <div className="flex gap-4 items-center">
                <Image className="rounded-full" src={image} width={24} height={24} alt="user image" />
                <h3 className="text-lg">Results</h3>
              </div>
              <div
                className="flex items-center gap-2"
                role="button"
                onClick={() => setFilterDialogOpen(true)}
              >
                <span className="text-lg">Filter</span>
                <FilterLeft />
              </div>
            </div>
            {items && <ResultsContainer items={items} />}
            <div className="w-full pt-4">
              <Link href="/upload">
                <button className="dark-background w-full flex justify-center items-center text-lg p-4 gap-2 rounded-full">
                  <ArrowRepeat />
                  Choose a new outfit
                </button>
              </Link>
            </div>
          </div>
        )}
      </section>
      <FilterDialog
        isOpen={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={() => {
          getProducts()
          setFilterDialogOpen(false)
        }}
      />
    </>
  )
}
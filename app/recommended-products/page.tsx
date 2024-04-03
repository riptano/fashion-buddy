"use client";
import { useEffect, useState } from "react";
import { useImage, useProcessedImage } from "@/components/ImageContext";
import ResultsContainer from "@/components/ResultsContainer";
import Image from "next/image";
import { ArrowRepeat, Cart, FilterLeft } from "react-bootstrap-icons";
import { useRouter } from "next/navigation";
import loadingGif from "@/assets/hourglass.gif";
import { Filters } from "@/utils/types";
import FilterDrawer from "@/components/FilterDrawer";

export default function RecommendedProducts() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState([]);
  const [image] = useImage();
  const [processedImage] = useProcessedImage();
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
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
      router.push("/");
    }
  }, []);

  const formatTitle = (str: string) => {
    return str.toLowerCase().replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  };

  return (
    <>
      <div className="cream-background h-screen">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Image src={loadingGif} alt="loading" width={80} height={80} />
          </div>
        ) : (
          <div className="flex flex-col md:p-0 h-full">
            {/* Filter Results desktop */}
            <div className="hidden md:flex w-full">
              <div
                className="fixed top-6 right-6"
                onClick={() => setIsOpen(!isOpen)}
              >
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

              <div className="min-h-screen max-w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
                  {items.map((item) => (
                    <div key={item._id} className="w-full h-auto">
                      <Image
                        src={item.product_images}
                        alt={item.product_name}
                        width={600}
                        height={400}
                        objectFit="cover"
                      />
                      <div className="p-4 cream-background">
                        <h5 className="text-base font-semibold truncate pb-2">
                          {formatTitle(item.product_name)}
                        </h5>
                        <p className="text-sm truncate-desc text-sm text-gray-600">
                          {item.details}
                        </p>
                        <div className="grid grid-cols-4 items-center gap-2 pt-2">
                          <div className="col-span-2 text-lg font-bold">
                            ${item.price}
                          </div>
                          <button className="bg-white py-2 rounded-full flex justify-center items-center text-xs text-nowrap whitespace-nowrap">
                            {Math.round(item.$similarity * 1000) / 10}% Match
                          </button>
                          <button className="slime-background py-2 rounded-full flex justify-center items-center text-xs text-nowrap whitespace-nowrap">
                            <Cart className="mr-2" />
                            Buy
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col h-screen md:hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b-2 border-black">
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

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <FilterDrawer onClose={() => setIsOpen(false)} image={image} />
        </>
      )}
    </>
  );
}

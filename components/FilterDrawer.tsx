"use client";
import { ArrowRepeat, X, FilterRight } from "react-bootstrap-icons";
import Image from "next/image";
import datastaxLogo from "@/assets/datastax-logo.png";
import { CATEGORIES, GENDERS } from "@/utils/consts";
import UploadPhotoDialog from "@/app/upload/page";
import { useState } from "react";
import { useImage } from "./ImageContext";

const FilterDrawer = ({
  onClose,
  setFilters,
  filters,
  isSingleSelect = false,
  isOpen,
  onApply,
}) => {
  const [image] = useImage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const formatOption = (option: string): string => {
    return option.split("_").map(capitalizeFirstLetter).join("/");
  };

  const handleRadioSelect = (option: string, section: string) => {
    setFilters((prev) => ({
      ...prev,
      [section]: prev[section].includes(option) ? [] : [option], // Toggle selection for single-select
    }));
  };

  const handleMultiSelect = (
    option: string,
    section: string,
    selectedOptions
  ) => {
    setFilters((prev) => {
      const isOptionSelected = selectedOptions.includes(option);
      return {
        ...prev,
        [section]: isOptionSelected
          ? prev[section].filter((item) => item !== option)
          : [...prev[section], option],
      };
    });
  };

  const handleSelect = (option: string, selection: string, selectedOptions) => {
    if (isSingleSelect) {
      handleRadioSelect(option, selection);
    } else {
      handleMultiSelect(option, selection, selectedOptions);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 md:w-[32rem] w-screen h-full shadow-xl transition-transform transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } z-50 cream-background`}
      >
        {/* Header */}
        <button
          className="absolute top-4 right-4 p-2 rounded-md"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <div
          className="overflow-y-auto"
          style={{ height: "calc(100% - 5rem)" }}
        >
          <div className="py-2 mt-4">
            <div className="flex flex-col p-8">
              <div className="py-2">
                <img
                  className="w-64 h-64 rounded-3xl mx-auto object-cover"
                  src={image}
                  alt="user image"
                />
              </div>
              <div className="flex items-center justify-center py-4">
                <button
                  className="flex items-center justify-center bg-black hover:brightness-75 text-white rounded-full px-6 py-4"
                  onClick={() => {
                    onClose();
                    setIsDialogOpen(true);
                  }}
                >
                  <ArrowRepeat size={20} className="mr-2" />
                  Choose a new outfit
                </button>
              </div>

              <div className="flex items-center justify-center pt-4 pb-8 text-xs border-b-2">
                Powered by{" "}
                <Image
                  className="ml-2"
                  src={datastaxLogo}
                  alt="DataStax Logo"
                  height={16}
                  width={107}
                />{" "}
              </div>
              <div className="text-lg pl-4 pb-3 pt-6 mb-6 border-b-2 border-black">
                Gender
              </div>
              <div className="grid grid-cols-2 gap-2">
                {GENDERS.map((gender, index) => (
                  <button
                    key={gender}
                    className={`py-3 px-4 hover:brightness-75 rounded-full ${
                      index === GENDERS.length - 1 ? "col-span-2" : ""
                    } ${
                      filters.gender.includes(gender)
                        ? "dark-background"
                        : "bg-white"
                    }`}
                    onClick={() =>
                      handleSelect(gender, "gender", filters.gender)
                    }
                  >
                    {formatOption(gender)}
                  </button>
                ))}
              </div>
              <div className="text-lg pl-4 pb-3 pt-6 mb-6 border-b-2 border-black">
                Categories
              </div>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((category, index) => (
                  <button
                    key={category}
                    className={`py-3 px-4 hover:brightness-75 rounded-full ${
                      index === CATEGORIES.length - 1 ? "col-span-2" : ""
                    } ${
                      filters.categories.includes(category)
                        ? "dark-background"
                        : "bg-white"
                    }`}
                    onClick={() =>
                      handleSelect(category, "categories", filters.categories)
                    }
                  >
                    {formatOption(category)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 w-full  border-t-2 pt-4 cream-background">
          <div className="grid grid-cols-2 justify-center gap-4 text-lg sm:px-2">
            <button
              className="hover:brightness-75"
              onClick={() => {
                setFilters({
                  gender: ["all"],
                  categories: [],
                });
              }}
            >
              Clear All
            </button>
            <button
              className="bg-black hover:brightness-75 text-white text-lg rounded-full flex items-center justify-center bg-black text-white rounded-full px-6 py-4"
              onClick={() => {
                onApply();
                onClose();
              }}
            >
              <FilterRight className="mr-2" size={24} />
              Apply Filters
            </button>
          </div>
        </div>
      </div>
      <UploadPhotoDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default FilterDrawer;

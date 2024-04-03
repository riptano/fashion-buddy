import { ArrowRepeat, X } from "react-bootstrap-icons";
import Image from "next/image";
import datastaxLogo from "@/assets/datastax-logo.png";
import { CATEGORIES, GENDERS } from "@/utils/consts";

const FilterDrawer = ({ onClose, image }) => {
  return (
    <div className="fixed top-0 right-0 w-1/3 h-full shadow-xl transition-transform transform translate-x-0 z-50 cream-background">
      {/* Header */}
      <button
        className="absolute top-4 right-4 p-2 rounded-md"
        onClick={onClose}
      >
        <X size={32} />
      </button>

      <div className="overflow-y-auto" style={{ height: "calc(100% - 5rem)" }}>
        <div className="py-2 mt-4">
          <div className="flex flex-col p-8">
            <div className="py-2 mt-4">
              <div className="">
                <Image
                  className="rounded-3xl mx-auto"
                  src={image}
                  alt="user image"
                  width={242}
                  height={242}
                  objectFit="contain"
                />
              </div>
            </div>
            <div className="flex items-center justify-center py-4">
              <button className="flex items-center justify-center bg-black text-white rounded-full px-6 py-4">
                <ArrowRepeat className="mr-2" />
                Choose a new outfit
              </button>
            </div>

            <div className="flex items-center justify-center pt-4 pb-8 border-b-2">
              Powered by{" "}
              <Image
                className="ml-2"
                src={datastaxLogo}
                alt="DataStax Logo"
                height={16}
                width={172}
              />{" "}
            </div>
            <div className="text-lg pl-4 pb-4 pt-6 mb-6 border-b-2 border-black">
              Gender
            </div>
            <div className="grid grid-cols-2 gap-2">
              {GENDERS.map((gender) => (
                <button
                  key={gender}
                  className="text-black bg-white py-4 px-6 rounded-full"
                >
                  {gender}
                </button>
              ))}
            </div>
            <div className="text-lg pl-4 pb-4 pt-6 mb-6 border-b-2 border-black">
              Categories
            </div>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  className="text-black bg-white py-4 px-6 rounded-full"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 w-full  border-t-2 pt-4 cream-background">
        <div className="flex justify-center gap-4">
          <button>Clear All</button>
          <button className="bg-black text-white rounded-full px-6 py-4">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterDrawer;

import { Filters } from "@/utils/types";

interface Props {
  section: "genders" | "categories";
  sectionOptions: string[];
  selectedOptions: string[];
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
}
const FilterSelector = ({
  section,
  sectionOptions,
  selectedOptions,
  setFilters,
}: Props) => {

  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  
  const formatOption = (option: string): string => {
    return option.split('_').map(capitalizeFirstLetter).join('/');
  }

  return (
    <div className="w-full mb-4">
      <h3 className="text-lg border-bottom mb-2">{section === 'genders' ? 'Gender' : 'Categories'}</h3>
      <div className="flex flex-wrap gap-2">
        {sectionOptions.map((option, index) => (
          <button
            key={index}
            className={`rounded-full p-2 text-sm font-semibold ${
              selectedOptions.includes(option) ? "dark-background" : "bg-white"
            }`}
            onClick={() => {
              if (selectedOptions.includes(option)) {
                setFilters((prev) => ({
                  ...prev,
                  [section]: prev[section].filter((item) => item !== option),
                }));
              } else {
                setFilters((prev) => ({
                  ...prev,
                  [section]: [...prev[section], option],
                }));
              }
            }}
          >
            {formatOption(option)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterSelector;

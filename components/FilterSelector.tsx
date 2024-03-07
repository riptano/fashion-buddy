import { Filters } from "@/utils/types";

interface Props {
  section: "gender" | "categories";
  sectionOptions: string[];
  selectedOptions: string[];
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  isSingleSelect?: boolean;
}
const FilterSelector = ({
  section,
  sectionOptions,
  selectedOptions,
  setFilters,
  isSingleSelect = false,
}: Props) => {

  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  
  const formatOption = (option: string): string => {
    return option.split('_').map(capitalizeFirstLetter).join('/');
  }

  const handleRadioSelect = (option: string) => {
    setFilters((prev) => ({
      ...prev,
      [section]: [option],
    }));
  }

  const handleMultiSelect = (option: string) => {
    if (selectedOptions.includes(option)) {
      setFilters((prev) => ({
        ...prev,
        categories: prev[section].filter((item) => item !== option),
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [section]: [...prev[section], option],
      }));
    }
  }

  const handleSelect = (option: string) => {
    if (isSingleSelect) {
      handleRadioSelect(option);
    } else {
      handleMultiSelect(option);
    }
  }

  return (
    <div className="w-full mb-4">
      <h3 className="text-lg border-bottom mb-2">{section === 'gender' ? 'Gender' : 'Categories'}</h3>
      <div className="flex flex-wrap gap-2">
        {sectionOptions.map(option => (
          <button
            key={option}
            className={`rounded-full p-2 text-sm font-semibold ${
              selectedOptions.includes(option) ? "dark-background" : "bg-white"
            }`}
            onClick={() => handleSelect(option)}
          >
            {formatOption(option)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterSelector;

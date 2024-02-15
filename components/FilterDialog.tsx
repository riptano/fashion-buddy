import { Filters } from "@/utils/types";
import FilterSelector from "./FilterSelector";
import { CATEGORIES, GENDERS } from "@/utils/consts";
import { FilterRight } from "react-bootstrap-icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  onApply: () => void;
}

const FilterDialog = ({ isOpen, onClose, filters, setFilters, onApply }: Props) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50">
      <div className="cream-background flex flex-col md:w-[750px] w-full md:h-[1000px] h-screen p-6 rounded shadow-lg overflow-auto">
        <div className='pb-6 flex justify-end'>
            <button
              onClick={onClose}
              className="chatbot-text-primary text-4xl font-thin leading-8"
            >
              <span aria-hidden>×</span>
            </button>
          </div>
        <div className="grow">
          <FilterSelector
            section="genders"
            sectionOptions={GENDERS}
            selectedOptions={filters.genders}
            setFilters={setFilters}
          />
          <FilterSelector
            section="categories"
            sectionOptions={CATEGORIES}
            selectedOptions={filters.categories}
            setFilters={setFilters}
          />
        </div>
        <div>
          <button
            className="flex items-center justify-center gap-2 w-full rounded-full p-4 text-lg font-semibold bg-white mb-2"
            onClick={() => setFilters({
              genders: [],
              categories: [],
            })}
            type="button"
          >
            Clear All
          </button>
          <button
            className="flex items-center justify-center gap-2 w-full rounded-full p-4 text-lg font-semibold dark-background"
            onClick={onApply}
            type="button"
          >
            <FilterRight />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
};

export default FilterDialog;

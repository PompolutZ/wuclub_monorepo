import { FilterDropdown } from "./FilterDropdown";
import { SortDropdown, SortOption } from "./SortDropdown";

interface FilterSortBarProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedSets: string[];
  onSetsChange: (sets: string[]) => void;
  onClearFilters: () => void;
  availableSets: string[];
}

export const FilterSortBar = ({
  sortBy,
  onSortChange,
  selectedSets,
  onSetsChange,
  onClearFilters,
  availableSets,
}: FilterSortBarProps) => {
  return (
    <div className="mb-4 flex flex-wrap gap-2 items-center">
      <SortDropdown currentSort={sortBy} onSortChange={onSortChange} />
      <FilterDropdown
        selectedSets={selectedSets}
        onSetsChange={onSetsChange}
        availableSets={availableSets}
      />
      {selectedSets.length > 0 && (
        <button
          onClick={onClearFilters}
          className="px-4 py-2 text-sm font-medium text-purple-700 bg-white border-2 border-purple-700 rounded-md hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 shadow-md"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

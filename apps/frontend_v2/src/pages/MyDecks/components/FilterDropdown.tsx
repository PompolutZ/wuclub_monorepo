import { ExpansionSeasonToggle } from "@components/ExpansionSeasonToggle";
import { Menu, Transition } from "@headlessui/react";
import { sets } from "@fxdxpz/wudb";
import type { Set as WuSet, SetId } from "@fxdxpz/wudb";
import { Filter, X } from "lucide-react";
import { Fragment } from "react";

interface FilterDropdownProps {
  selectedSets: string[];
  onSetsChange: (sets: string[]) => void;
  availableSets: string[];
}

export const FilterDropdown = ({
  selectedSets,
  onSetsChange,
  availableSets,
}: FilterDropdownProps) => {
  const expansions: WuSet[] = availableSets
    .map((setId) => sets[setId as keyof typeof sets])
    .filter((set): set is WuSet => Boolean(set));

  const handleToggleSet = (setId: SetId) => {
    const sid = setId as string;
    onSetsChange(
      selectedSets.includes(sid)
        ? selectedSets.filter((id) => id !== sid)
        : [...selectedSets, sid],
    );
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center justify-center w-32 lg:w-auto px-4 py-2 text-sm font-medium text-purple-700 bg-white border-2 border-purple-700 rounded-md hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 shadow-md">
        <Filter className="w-4 h-4 mr-2" />
        <span className="hidden lg:inline">Filter by Sets</span>
        <span className="lg:hidden">Filter</span>
        {selectedSets.length > 0 && (
          <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-purple-700 rounded-full">
            {selectedSets.length}
          </span>
        )}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 z-10 mt-2 w-72 lg:w-80 origin-top lg:origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="max-h-72 overflow-y-auto p-3">
            <ExpansionSeasonToggle
              expansions={expansions}
              selectedIds={selectedSets as SetId[]}
              onToggle={handleToggleSet}
            />
          </div>
          {selectedSets.length > 0 && (
            <div className="border-t border-gray-100 p-2">
              <button
                onClick={() => onSetsChange([])}
                className="w-full inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50 rounded-md"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all filters
              </button>
            </div>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

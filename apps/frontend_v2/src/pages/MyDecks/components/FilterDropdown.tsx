import { Menu, Transition } from "@headlessui/react";
import { Filter, X } from "lucide-react";
import { Fragment, useState } from "react";
import { ExpansionPicture } from "@components/ExpansionPicture";
import { sets } from "@wudb/sets";
import { setHasPlot } from "@wudb/index";
import CompassIcon from "@icons/compass.svg?react";

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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSets = availableSets.filter((setId) => {
    const set = sets[setId as keyof typeof sets];
    if (!set) return false;
    return (
      set.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      set.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleToggleSet = (setId: string) => {
    if (selectedSets.includes(setId)) {
      onSetsChange(selectedSets.filter((id) => id !== setId));
    } else {
      onSetsChange([...selectedSets, setId]);
    }
  };

  const handleClearAll = () => {
    onSetsChange([]);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center justify-between w-full lg:w-auto px-4 py-2 text-sm font-medium text-purple-700 bg-white border-2 border-purple-700 rounded-md hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 shadow-md">
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
          <div className="p-2">
            <input
              type="text"
              placeholder="Search sets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredSets.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                No sets found
              </div>
            ) : (
              filteredSets.map((setId) => {
                const set = sets[setId as keyof typeof sets];
                if (!set) return null;

                const hasPlot = setHasPlot(setId as any);

                return (
                  <Menu.Item key={setId}>
                    {({ active }) => (
                      <button
                        onClick={() => handleToggleSet(setId)}
                        className={`${
                          active ? "bg-purple-50" : ""
                        } group flex w-full items-center px-4 py-2 text-sm text-gray-900`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSets.includes(setId)}
                          onChange={() => {}}
                          className="w-4 h-4 text-purple-700 border-gray-300 rounded focus:ring-purple-500 mr-3"
                        />
                        <div className="relative mr-2">
                          <ExpansionPicture
                            setName={set.name}
                            className="w-8 h-8"
                          />
                          {hasPlot && (
                            <div className="absolute w-4 h-4 bg-purple-700 -bottom-1 left-4 rounded-full text-white" title="Has Plot Card">
                              <CompassIcon className="stroke-current w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <span className="flex-1 text-left">
                          {set.displayName}
                        </span>
                      </button>
                    )}
                  </Menu.Item>
                );
              })
            )}
          </div>
          {selectedSets.length > 0 && (
            <div className="border-t border-gray-100 p-2">
              <button
                onClick={handleClearAll}
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

import { Menu, Transition } from "@headlessui/react";
import { ArrowDownUp, Check } from "lucide-react";
import { Fragment } from "react";

export type SortOption = "name-asc" | "name-desc" | "date-desc" | "date-asc";

interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "name-asc", label: "Name (A → Z)" },
  { value: "name-desc", label: "Name (Z → A)" },
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
];

export const SortDropdown = ({
  currentSort,
  onSortChange,
}: SortDropdownProps) => {
  const currentLabel =
    sortOptions.find((opt) => opt.value === currentSort)?.label || "Sort";

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center justify-between w-full lg:w-auto px-4 py-2 text-sm font-medium text-purple-700 bg-white border-2 border-purple-700 rounded-md hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 shadow-md">
        <ArrowDownUp className="w-4 h-4 mr-2" />
        <span className="hidden lg:inline">{currentLabel}</span>
        <span className="lg:hidden">Sort</span>
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
        <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {sortOptions.map((option) => (
              <Menu.Item key={option.value}>
                {({ active }) => (
                  <button
                    onClick={() => onSortChange(option.value)}
                    className={`${
                      active ? "bg-purple-100" : ""
                    } group flex w-full items-center px-4 py-2 text-sm text-gray-900`}
                  >
                    <span className="flex-1 text-left">{option.label}</span>
                    {currentSort === option.value && (
                      <Check className="w-4 h-4 text-purple-700" />
                    )}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

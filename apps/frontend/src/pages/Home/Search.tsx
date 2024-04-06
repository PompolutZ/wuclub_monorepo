import SearchIcon from "@icons/magnifying-glass.svg?react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { getSetNameById } from "@wudb";
import { useCombobox } from "downshift";
import Fuse, { FuseResult, RangeTuple } from "fuse.js";
import { useRef, useState } from "react";
import { Card } from "../../data/wudb/types";

function estimateSize() {
  return 40;
}

type SubstringInfo = {
  text: string;
  highlight: boolean;
};

function highlightSubstrings(
  value: string,
  indices: readonly RangeTuple[],
): SubstringInfo[] {
  const substrings: SubstringInfo[] = [];
  let lastIndex = 0;

  indices.forEach(([start, end]) => {
    // Add the text before the highlight
    if (start > lastIndex) {
      substrings.push({
        text: value.substring(lastIndex, start),
        highlight: false,
      });
    }
    const inclusiveEnd = end + 1;
    // Add the highlighted text
    substrings.push({
      text: value.substring(start, inclusiveEnd),
      highlight: true,
    });
    lastIndex = inclusiveEnd;
  });

  // Add any remaining text after the last highlight
  if (lastIndex < value.length) {
    substrings.push({ text: value.substring(lastIndex), highlight: false });
  }

  return substrings;
}

export function AutosuggestSearch({
  onClick,
}: {
  onClick: (card: Card) => void;
}) {
  const [items, setItems] = useState<FuseResult<Card>[]>([]);
  const listRef = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => listRef.current,
    estimateSize,
    overscan: 2,
  });

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items: items,
    onInputValueChange: async ({ inputValue }) => {
      const { wucards } = await import("@wudb");
      const fuse = new Fuse(Object.values<Card>(wucards), {
        keys: ["name"],
        threshold: 0.05,
        includeMatches: true,
        minMatchCharLength: 2,
        ignoreLocation: true,
      });

      const searchResults = inputValue
        ? fuse
            .search(inputValue)
            .toSorted((prev, next) => next.item.id - prev.item.id)
        : [];

      setItems(searchResults);
    },
    itemToString: (item: FuseResult<Card> | null) => {
      return item ? item.item.name : "";
    },
  });

  return (
    <div className="relative">
      <div className="flex">
        <input
          {...getInputProps()}
          className="peer rounded h-12 bg-gray-200 box-border flex-1 py-1 px-2 outline-none border-2 focus:border-purple-700"
        />
        <button
          className="absolute right-0 w-12 border-gray-500 peer-focus:text-white peer-focus:border-purple-700 border-l-0 peer-focus:bg-purple-700 box-border border-2"
          aria-label="toggle menu"
          disabled={!selectedItem}
          onClick={() => onClick(selectedItem?.item!)}
        >
          <div className="h-11 flex justify-center items-center stroke-current">
            <SearchIcon className="w-8 h-8 stroke-current" />
          </div>
        </button>
      </div>
      <ul
        className={`absolute w-full bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10 ${
          !(isOpen && items.length) && "hidden"
        }`}
        {...getMenuProps({ ref: listRef })}
      >
        {isOpen && (
          <>
            <li
              key="total-size"
              style={{ height: rowVirtualizer.getTotalSize() }}
            />
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const {
                item: { id, setId, type },
                matches,
              } = items[virtualRow.index];

              const { indices, value } = matches?.[0] ?? {};
              const valueNodes =
                indices && highlightSubstrings(value ?? "", indices);

              return (
                <li
                  key={id}
                  className={`absolute inset-0 flex items-center gap-6 px-2 ${
                    highlightedIndex === virtualRow.index
                      ? "bg-purple-100 cursor-pointer"
                      : "cursor-text"
                  }`}
                  style={{
                    height: virtualRow.size,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  {...getItemProps({
                    index: virtualRow.index,
                    item: items[virtualRow.index],
                  })}
                  onClick={() => onClick(items[virtualRow.index].item)}
                >
                  <img
                    className="w-8 h-8 relative"
                    alt={`${type}`}
                    src={`/assets/icons/${type.toLowerCase()}-icon.png`}
                  />
                  <img
                    className="w-8 h-8 absolute left-6"
                    alt={`${getSetNameById(setId)}`}
                    src={`/assets/icons/${getSetNameById(setId)}-icon.png`}
                  />
                  <div>
                    {valueNodes?.map(({ text, highlight }, index) => {
                      return (
                        <span
                          key={index}
                          className={`${
                            highlight
                              ? "text-gray-900 font-bold"
                              : "text-gray-500"
                          }`}
                        >
                          {text}
                        </span>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </>
        )}
      </ul>
    </div>
  );
}

import CloseIcon from "@icons/x.svg?react";
import TogglesIcon from "@icons/sliders.svg?react";
import type { Card } from "../../data/wudb";
import { DebouncedInput } from "../../shared/components/DebouncedInput";
import { GroupedExpansions } from "../../shared/components/GrouppedExpansions";
import IconButton from "../../shared/components/IconButton";
import { Overlay } from "../../shared/components/Overlay";
import { ScrollContainer } from "../../shared/components/ScrollContainer";
import BottomPanelNavigation from "@components/BottomPanelNavigation";
import LibraryCardSection from "./LibraryCardSection";

interface LibraryMobileViewProps {
  validSetIds: string[];
  selectedExpansionIds: string[];
  setSelectedExpansionIds: (ids: string[]) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  cardsBySet: { setId: string; cards: Card[] }[];
  filteredCards: Card[];
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
  tabs: { name: string; Icon: React.ComponentType<{ className?: string }> }[];
}

export function LibraryMobileView({
  validSetIds,
  selectedExpansionIds,
  setSelectedExpansionIds,
  searchText,
  setSearchText,
  showFilters,
  setShowFilters,
  cardsBySet,
  filteredCards,
  activeTabIndex,
  setActiveTabIndex,
  tabs,
}: LibraryMobileViewProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center p-2 gap-2">
        <DebouncedInput
          className="rounded h-12 bg-gray-200 box-border flex-1 py-1 px-2 outline-none border-2 focus:border-purple-700"
          placeholder="Search for any text on card"
          onChange={setSearchText}
        />
        <IconButton
          className="rounded-full px-2 w-11 h-11 grid place-content-center relative hover:bg-gray-100 focus:text-purple-700"
          onClick={() => setShowFilters(true)}
        >
          <TogglesIcon />
        </IconButton>
      </div>

      <Overlay visible={showFilters}>
        <div className="flex-1 flex flex-col pt-4 pb-12">
          <IconButton
            onClick={() => setShowFilters(false)}
            className="rounded-full ml-3 px-2 w-11 h-11 grid place-content-center relative hover:bg-gray-100 self-end"
          >
            <CloseIcon />
          </IconButton>
          <div className="overflow-y-auto">
            <GroupedExpansions
              validSetIds={validSetIds as never[]}
              selectedExpansions={selectedExpansionIds as never[]}
              onSelectionChanged={setSelectedExpansionIds as never}
            />
          </div>
        </div>
      </Overlay>

      {activeTabIndex === 0 ? (
        <ScrollContainer className="px-2 pb-4">
          {filteredCards.length === 0 ? (
            <div className="flex items-center justify-center text-gray-900 text-xl mt-8">
              No cards matching your filters.
            </div>
          ) : (
            <>
              {cardsBySet.map(({ setId, cards }) => (
                <LibraryCardSection key={setId} setId={setId} cards={cards} />
              ))}
            </>
          )}
        </ScrollContainer>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-xl">
          Coming soon
        </div>
      )}
      <BottomPanelNavigation
        tabs={tabs}
        activeTabIndex={activeTabIndex}
        setActiveTabIndex={setActiveTabIndex}
      />
    </div>
  );
}

import CloseIcon from "@icons/x.svg?react";
import TogglesIcon from "@icons/sliders.svg?react";
import { useState } from "react";
import type { Card, Set, SetId } from "@fxdxpz/wudb";
import { factionMembers } from "@fxdxpz/wudb";
import { DebouncedInput } from "../../shared/components/DebouncedInput";
import { FactionPicture } from "@components/FactionDeckPicture";
import { ExpansionSeasonToggle } from "../../shared/components/ExpansionSeasonToggle";
import SectionTitle from "../../shared/components/SectionTitle";
import IconButton from "../../shared/components/IconButton";
import { Overlay } from "../../shared/components/Overlay";
import { ScrollContainer } from "../../shared/components/ScrollContainer";
import BottomPanelNavigation from "@components/BottomPanelNavigation";
import FightersInfoList from "../../atoms/FightersInfoList";
import LibraryCardSection from "./LibraryCardSection";
import { LibraryWarbandPicker } from "./LibraryWarbandPicker";
import { Warband } from "../../shared/components/WarbandPicker";

interface LibraryMobileViewProps {
  validSets: Set[];
  selectedExpansionIds: string[];
  onExpansionToggle: (setId: SetId) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  cardsBySet: { setId: string; cards: Card[] }[];
  filteredCards: Card[];
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
  tabs: { name: string; Icon: React.ComponentType<{ className?: string }> }[];
  selectedFaction: Warband;
  setSelectedFaction: (faction: Warband) => void;
  playableWarbands: Warband[];
}

export function LibraryMobileView({
  validSets,
  selectedExpansionIds,
  onExpansionToggle,
  setSearchText,
  showFilters,
  setShowFilters,
  cardsBySet,
  filteredCards,
  activeTabIndex,
  setActiveTabIndex,
  tabs,
  selectedFaction,
  setSelectedFaction,
  playableWarbands,
}: LibraryMobileViewProps) {
  const [showWarbandPicker, setShowWarbandPicker] = useState(false);

  const handleSelectWarband = (faction: Warband) => {
    setSelectedFaction(faction);
    setShowWarbandPicker(false);
  };

  return (
    <div className="flex-1 flex flex-col">
      {activeTabIndex === 0 ? (
        <div className="flex items-center p-2 gap-2 bg-gray-200">
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
      ) : (
        <div className="flex items-center p-2 gap-2 bg-gray-200">
          <FactionPicture faction={selectedFaction.name} size="w-11 h-11" />
          <span className="flex-1 text-gray-900 font-medium">
            {selectedFaction.displayName}
          </span>
          <IconButton
            className="rounded-full px-2 w-11 h-11 grid place-content-center relative hover:bg-gray-100 focus:text-purple-700"
            onClick={() => setShowWarbandPicker(true)}
          >
            <TogglesIcon />
          </IconButton>
        </div>
      )}

      <Overlay visible={showFilters}>
        <div className="flex-1 flex flex-col pt-4 px-4">
          <IconButton
            onClick={() => setShowFilters(false)}
            className="rounded-full ml-3 px-2 w-11 h-11 grid place-content-center relative hover:bg-gray-100 self-end"
          >
            <CloseIcon />
          </IconButton>
          <SectionTitle title="Expansions" />
          <ExpansionSeasonToggle
            expansions={validSets}
            selectedIds={selectedExpansionIds as SetId[]}
            onToggle={onExpansionToggle}
          />
        </div>
      </Overlay>

      <Overlay visible={showWarbandPicker}>
        <div className="flex-1 flex flex-col pt-4 pb-12">
          <div className="overflow-y-auto">
            <LibraryWarbandPicker
              warbands={playableWarbands}
              selected={selectedFaction}
              onSelect={handleSelectWarband}
              onClose={() => setShowWarbandPicker(false)}
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
        <FightersInfoList
          factionName={selectedFaction.name as keyof typeof factionMembers}
        />
      )}
      <BottomPanelNavigation
        tabs={tabs}
        activeTabIndex={activeTabIndex}
        setActiveTabIndex={setActiveTabIndex}
      />
    </div>
  );
}

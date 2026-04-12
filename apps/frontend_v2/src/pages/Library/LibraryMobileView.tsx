import CloseIcon from "@icons/x.svg?react";
import TogglesIcon from "@icons/sliders.svg?react";
import { useCallback, useRef, useState } from "react";
import type { Set, SetId } from "@fxdxpz/wudb";
import { factionMembers } from "@fxdxpz/wudb";
import { useVirtualizer } from "@tanstack/react-virtual";
import { DebouncedInput } from "../../shared/components/DebouncedInput";
import { FactionPicture } from "@components/FactionDeckPicture";
import { ExpansionSeasonToggle } from "../../shared/components/ExpansionSeasonToggle";
import SectionTitle from "../../shared/components/SectionTitle";
import IconButton from "../../shared/components/IconButton";
import { Overlay } from "../../shared/components/Overlay";
import { PlotCard } from "../../shared/components/PlotCard";
import BottomPanelNavigation from "@components/BottomPanelNavigation";
import FightersInfoList from "../../atoms/FightersInfoList";
import LibraryCardRow from "./LibraryCardRow";
import { LibraryWarbandPicker } from "./LibraryWarbandPicker";
import { SetHeader } from "./SetHeader";
import { useStickyVirtualHeader } from "./useStickyVirtualHeader";
import { Warband } from "../../shared/components/WarbandPicker";
import type { VirtualRow } from "./Library";

const HEADER_HEIGHT = 52;
const CARD_ROW_HEIGHT_ESTIMATE = 48;

interface LibraryMobileViewProps {
  validSets: Set[];
  selectedExpansionIds: string[];
  onExpansionToggle: (setId: SetId) => void;
  setSearchText: (text: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  virtualRows: VirtualRow[];
  stickyIndices: number[];
  hasCards: boolean;
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
  virtualRows,
  stickyIndices,
  hasCards,
  activeTabIndex,
  setActiveTabIndex,
  tabs,
  selectedFaction,
  setSelectedFaction,
  playableWarbands,
}: LibraryMobileViewProps) {
  const [showWarbandPicker, setShowWarbandPicker] = useState(false);
  const [viewingPlotSetId, setViewingPlotSetId] = useState<string | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleSelectWarband = (faction: Warband) => {
    setSelectedFaction(faction);
    setShowWarbandPicker(false);
  };

  const handleViewPlot = useCallback((setId: string) => {
    setViewingPlotSetId(setId);
  }, []);

  const virtualizer = useVirtualizer({
    count: virtualRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) =>
      virtualRows[i]?.type === "header"
        ? HEADER_HEIGHT
        : CARD_ROW_HEIGHT_ESTIMATE,
    measureElement: (el) => el.getBoundingClientRect().height,
    overscan: 5,
  });

  const { activeHeader } = useStickyVirtualHeader(
    virtualRows,
    stickyIndices,
    virtualizer,
    parentRef,
    overlayRef,
  );

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
        !hasCards ? (
          <div className="flex-1 flex items-center justify-center text-gray-900 text-xl">
            No cards matching your filters.
          </div>
        ) : (
          <div
            ref={parentRef}
            className="flex-1 [contain:strict] overflow-y-auto relative"
          >
            <div className="sticky top-0 z-10 h-0">
              <div ref={overlayRef} style={{ opacity: 0 }}>
                {activeHeader && (
                  <SetHeader
                    setId={activeHeader.setId}
                    setName={activeHeader.setName}
                    displayName={activeHeader.displayName}
                    count={activeHeader.count}
                    hasPlot={activeHeader.hasPlot}
                    onViewPlot={handleViewPlot}
                  />
                )}
              </div>
            </div>
            <div
              className="w-full relative"
              style={{ height: virtualizer.getTotalSize() }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const row = virtualRows[virtualRow.index];
                return (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {row.type === "header" ? (
                      <SetHeader
                        setId={row.setId}
                        setName={row.setName}
                        displayName={row.displayName}
                        count={row.count}
                        hasPlot={row.hasPlot}
                        onViewPlot={handleViewPlot}
                      />
                    ) : (
                      row.cards.map((card) => (
                        <LibraryCardRow
                          key={card.id}
                          cardId={card.id}
                          isAlternate={virtualRow.index % 2 === 0}
                        />
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )
      ) : (
        <FightersInfoList
          factionName={selectedFaction.name as keyof typeof factionMembers}
        />
      )}

      {viewingPlotSetId && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center cursor-pointer"
          onClick={() => setViewingPlotSetId(null)}
        >
          <div className="w-80">
            <PlotCard set={viewingPlotSetId} />
          </div>
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

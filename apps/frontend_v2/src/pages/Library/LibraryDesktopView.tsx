import { useCallback, useRef, useState } from "react";
import type { Card, Set, SetId } from "@fxdxpz/wudb";
import { factionMembers } from "@fxdxpz/wudb";
import { useVirtualizer } from "@tanstack/react-virtual";
import { CardPicture } from "../../shared/components/CardPicture";
import { DebouncedInput } from "../../shared/components/DebouncedInput";
import { PlotCard } from "../../shared/components/PlotCard";
import { ExpansionSeasonToggle } from "../../shared/components/ExpansionSeasonToggle";
import SectionTitle from "../../shared/components/SectionTitle";
import BottomPanelNavigation from "@components/BottomPanelNavigation";
import FightersInfoList from "../../atoms/FightersInfoList";
import { ZoomedCard } from "./ZoomedCard";
import { LibraryWarbandPicker } from "./LibraryWarbandPicker";
import { SetHeader } from "./SetHeader";
import { useStickyVirtualHeader } from "./useStickyVirtualHeader";
import type { VirtualRow } from "./Library";
import type { Warband } from "../../shared/components/WarbandPicker";

const HEADER_HEIGHT = 52;
const CARD_ROW_HEIGHT_ESTIMATE = 350;

interface LibraryDesktopViewProps {
  validSets: Set[];
  selectedExpansionIds: string[];
  onExpansionToggle: (setId: SetId) => void;
  setSearchText: (text: string) => void;
  virtualRows: VirtualRow[];
  stickyIndices: number[];
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
  tabs: { name: string; Icon: React.ComponentType<{ className?: string }> }[];
  zoomedCard: { card: Card; rect: DOMRect } | null;
  zoomAnimating: boolean;
  onCardClick: (card: Card, el: HTMLElement) => void;
  onZoomClose: () => void;
  selectedFaction: Warband;
  setSelectedFaction: (faction: Warband) => void;
  playableWarbands: Warband[];
}

export function LibraryDesktopView({
  validSets,
  selectedExpansionIds,
  onExpansionToggle,
  setSearchText,
  virtualRows,
  stickyIndices,
  activeTabIndex,
  setActiveTabIndex,
  tabs,
  zoomedCard,
  zoomAnimating,
  onCardClick,
  onZoomClose,
  selectedFaction,
  setSelectedFaction,
  playableWarbands,
}: LibraryDesktopViewProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [viewingPlotSetId, setViewingPlotSetId] = useState<string | null>(null);

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
    <div className="flex-1 flex lg:grid lg:grid-cols-12 p-4 lg:p-0">
      <BottomPanelNavigation
        tabs={tabs}
        activeTabIndex={activeTabIndex}
        setActiveTabIndex={setActiveTabIndex}
        orientation="vertical"
      />
      <div className="bg-gray-200 space-y-3 lg:col-span-3 px-4">
        {activeTabIndex === 0 ? (
          <>
            <section className="mx-2 mt-2">
              <DebouncedInput
                className="rounded h-10 bg-white box-border w-full py-1 px-2 outline-none border-2 focus:border-purple-700"
                placeholder="Search for text on a card"
                onChange={setSearchText}
              />
            </section>
            <SectionTitle title="Expansions" />
            <ExpansionSeasonToggle
              expansions={validSets}
              selectedIds={selectedExpansionIds as SetId[]}
              onToggle={onExpansionToggle}
            />
          </>
        ) : (
          <div className="overflow-y-auto">
            <LibraryWarbandPicker
              warbands={playableWarbands}
              selected={selectedFaction}
              onSelect={setSelectedFaction}
            />
          </div>
        )}
      </div>
      <div className="flex-1 lg:col-span-8 flex flex-col lg:px-2">
        {activeTabIndex === 0 ? (
          virtualRows.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-900 text-xl">
              <div>
                <img
                  src="/assets/art/not-found.png"
                  alt="No result matching filter."
                />
                Oops! Seems like there are no cards matching your filters.
              </div>
            </div>
          ) : (
            <div
              ref={parentRef}
              className="flex-1 [contain:strict] overflow-y-auto outline-none scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 relative"
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
                        <div className="grid grid-cols-5">
                          {row.cards.map((card) => {
                            const isZoomed = zoomedCard?.card.id === card.id;
                            const cardHoverHalo =
                              card.type === "Objective"
                                ? "hover:drop-shadow-[0_0_8px_rgba(242,192,63,0.85)]"
                                : "hover:drop-shadow-[0_0_8px_rgba(142,20,7,0.85)]";
                            return (
                              <div
                                key={card.id}
                                className="p-2 flex items-center justify-center cursor-pointer"
                                style={isZoomed ? { opacity: 0 } : undefined}
                                onClick={(e) =>
                                  onCardClick(card, e.currentTarget)
                                }
                              >
                                <CardPicture
                                  card={card}
                                  imgClassName={`transition-all duration-300 ${cardHoverHalo}`}
                                />
                              </div>
                            );
                          })}
                        </div>
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
      </div>
      {zoomedCard && (
        <ZoomedCard
          {...zoomedCard}
          onClose={onZoomClose}
          isZoomAnimating={zoomAnimating}
        />
      )}
      {viewingPlotSetId && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center cursor-pointer"
          onClick={() => setViewingPlotSetId(null)}
        >
          <div className="w-80 lg:w-96">
            <PlotCard set={viewingPlotSetId} />
          </div>
        </div>
      )}
    </div>
  );
}

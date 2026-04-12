import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { Card, Set, SetId } from "@fxdxpz/wudb";
import { factionMembers } from "@fxdxpz/wudb";
import { useVirtualizer } from "@tanstack/react-virtual";
import CompassIcon from "@icons/compass.svg?react";
import { CardPicture } from "../../shared/components/CardPicture";
import { DebouncedInput } from "../../shared/components/DebouncedInput";
import { RivalsDeckIcon } from "../../shared/components/RivalsDeckIcon";
import { PlotCard } from "../../shared/components/PlotCard";
import { ExpansionSeasonToggle } from "../../shared/components/ExpansionSeasonToggle";
import SectionTitle from "../../shared/components/SectionTitle";
import BottomPanelNavigation from "@components/BottomPanelNavigation";
import FightersInfoList from "../../atoms/FightersInfoList";
import { ZoomedCard } from "./ZoomedCard";
import { LibraryWarbandPicker } from "./LibraryWarbandPicker";
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
  const [activeHeader, setActiveHeader] = useState<
    (VirtualRow & { type: "header" }) | null
  >(null);
  const activeIdxRef = useRef(-1);
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

  // Ref holds the latest update fn — avoids stale closures in the scroll listener
  const stickyUpdateRef = useRef<() => void>(() => {});
  stickyUpdateRef.current = () => {
    const el = parentRef.current;
    if (!el || !overlayRef.current || stickyIndices.length === 0) return;

    const scrollTop = el.scrollTop;
    const measurements = virtualizer.measurementsCache;

    let newActiveIdx = stickyIndices[0];
    let activeStart = measurements[newActiveIdx]?.start ?? 0;
    let nextStart: number | undefined;

    for (let i = 0; i < stickyIndices.length; i++) {
      const m = measurements[stickyIndices[i]];
      if (m && m.start <= scrollTop + 1) {
        newActiveIdx = stickyIndices[i];
        activeStart = m.start;
        nextStart =
          i + 1 < stickyIndices.length
            ? measurements[stickyIndices[i + 1]]?.start
            : undefined;
      }
    }

    if (newActiveIdx !== activeIdxRef.current) {
      activeIdxRef.current = newActiveIdx;
      const row = virtualRows[newActiveIdx];
      if (row?.type === "header") setActiveHeader(row);
    }

    // Use measured height from the overlay DOM (avoids hardcoded constants drifting).
    // Only read offsetHeight — never set margin/layout props here (causes reflow → infinite loop).
    const headerHeight = overlayRef.current.children[0]
      ? (overlayRef.current.children[0] as HTMLElement).offsetHeight
      : HEADER_HEIGHT;

    if (nextStart !== undefined) {
      const distanceToNext = nextStart - scrollTop;
      overlayRef.current.style.transform =
        distanceToNext < headerHeight
          ? `translateY(${distanceToNext - headerHeight}px)`
          : "";
    } else {
      overlayRef.current.style.transform = "";
    }

    overlayRef.current.style.opacity = scrollTop >= activeStart ? "1" : "0";
  };

  // Reset active header when data changes (expansion toggle, search)
  useLayoutEffect(() => {
    activeIdxRef.current = -1;
  }, [stickyIndices]);

  // Sync after virtualizer re-measures items
  useLayoutEffect(() => stickyUpdateRef.current());

  // Per-pixel smooth updates via native scroll
  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;
    const onScroll = () => stickyUpdateRef.current();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  });

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

interface SetHeaderProps {
  setId: string;
  setName: string;
  displayName: string;
  count: number;
  hasPlot: boolean;
  onViewPlot: (setId: string) => void;
}

function SetHeader({
  setId,
  setName,
  displayName,
  count,
  hasPlot,
  onViewPlot,
}: SetHeaderProps) {
  return (
    <div className="flex items-center bg-white border-b border-gray-300 px-2 py-2">
      <RivalsDeckIcon
        setName={setName}
        setId={setId}
        className="w-8 h-8 mr-2"
      />
      <div className="flex-1 min-w-0">
        <h2 className="text-gray-900 text-base font-medium truncate">
          {displayName}
        </h2>
        {hasPlot && (
          <button
            onClick={() => onViewPlot(setId)}
            className="text-xs text-purple-700 hover:underline flex items-center gap-1"
          >
            <CompassIcon className="w-3 h-3 stroke-purple-700" />
            View plot card
          </button>
        )}
      </div>
      <span className="text-gray-500 text-sm ml-2">{count}</span>
    </div>
  );
}

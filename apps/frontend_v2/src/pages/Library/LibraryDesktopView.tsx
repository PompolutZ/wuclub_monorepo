import type { Card } from "@fxdxpz/wudb";
import { factionMembers } from "@fxdxpz/wudb";
import { CardPicture } from "../../shared/components/CardPicture";
import { DebouncedInput } from "../../shared/components/DebouncedInput";
import { FixedVirtualizedList } from "../../shared/components/FixedVirtualizedList";
import { GroupedExpansions } from "../../shared/components/GrouppedExpansions";
import BottomPanelNavigation from "@components/BottomPanelNavigation";
import FightersInfoList from "../../atoms/FightersInfoList";
import { ZoomedCard } from "./ZoomedCard";
import { LibraryWarbandPicker } from "./LibraryWarbandPicker";
import type { Warband } from "../../shared/components/WarbandPicker";

interface LibraryDesktopViewProps {
  validSetIds: string[];
  selectedExpansionIds: string[];
  setSelectedExpansionIds: (ids: string[]) => void;
  setSearchText: (text: string) => void;
  filteredCards: Card[];
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
  validSetIds,
  selectedExpansionIds,
  setSelectedExpansionIds,
  setSearchText,
  filteredCards,
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
  return (
    <div className="flex-1 flex lg:grid lg:grid-cols-12 p-4 lg:p-0">
      <BottomPanelNavigation
        tabs={tabs}
        activeTabIndex={activeTabIndex}
        setActiveTabIndex={setActiveTabIndex}
        orientation="vertical"
      />
      <div className="bg-gray-200 space-y-3 lg:col-span-3">
        {activeTabIndex === 0 ? (
          <>
            <section className="mx-2 mt-2">
              <DebouncedInput
                className="rounded h-10 bg-white box-border w-full py-1 px-2 outline-none border-2 focus:border-purple-700"
                placeholder="Search for text on a card"
                onChange={setSearchText}
              />
            </section>
            <GroupedExpansions
              validSetIds={validSetIds as never[]}
              selectedExpansions={selectedExpansionIds as never[]}
              onSelectionChanged={setSelectedExpansionIds as never}
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
          filteredCards.length === 0 ? (
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
            <div className="flex-1 flex">
              <FixedVirtualizedList items={filteredCards} variant="grid">
                {(cards, { key }) =>
                  Array.isArray(cards) ? (
                    <div className="flex" key={key}>
                      {(cards as Card[]).map((card) => {
                        const isZoomed = zoomedCard?.card.id === card.id;
                        const cardHoverHalo =
                          card.type === "Objective"
                            ? "hover:drop-shadow-[0_0_8px_rgba(242,192,63,0.85)]"
                            : "hover:drop-shadow-[0_0_8px_rgba(142,20,7,0.85)]";
                        return (
                          <div
                            key={card.id}
                            className="flex-1 p-2 flex items-center justify-center cursor-pointer"
                            style={isZoomed ? { opacity: 0 } : undefined}
                            onClick={(e) => onCardClick(card, e.currentTarget)}
                          >
                            <CardPicture
                              card={card}
                              imgClassName={`transition-all duration-300 ${cardHoverHalo}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <></>
                  )
                }
              </FixedVirtualizedList>
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
    </div>
  );
}

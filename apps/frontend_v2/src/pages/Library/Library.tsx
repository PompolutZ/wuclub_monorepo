import CloseIcon from "@icons/x.svg?react";
import TogglesIcon from "@icons/sliders.svg?react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAllSetsValidForFormat,
  NEMESIS_FORMAT,
  wucards,
  wufactions,
} from "../../data/wudb";
import type { Card } from "../../data/wudb";
import { useBreakpoint } from "../../hooks/useMediaQuery";
import { CardPicture } from "../../shared/components/CardPicture";
import { DebouncedInput } from "../../shared/components/DebouncedInput";
import { FixedVirtualizedList } from "../../shared/components/FixedVirtualizedList";
import { GroupedExpansions } from "../../shared/components/GrouppedExpansions";
import IconButton from "../../shared/components/IconButton";
import { Overlay } from "../../shared/components/Overlay";
import { ScrollContainer } from "../../shared/components/ScrollContainer";
import { ModalPresenter } from "../../main";
import LibraryCardSection from "./LibraryCardSection";
import { ZoomedCard } from "./ZoomedCard";

const validSets = getAllSetsValidForFormat(NEMESIS_FORMAT);
const validSetIds = validSets.map((s) => s.id as string);
const universalFactionId = wufactions["u"].id;

function useLibraryCards(selectedExpansionIds: string[], searchText: string) {
  return useMemo(() => {
    let cards = Object.values(wucards).filter(
      (card) =>
        card.factionId === universalFactionId &&
        card.setId &&
        selectedExpansionIds.includes(card.setId as string),
    );

    if (searchText) {
      const upper = searchText.toUpperCase();
      cards = cards.filter(
        (card) =>
          card.name.toUpperCase().includes(upper) ||
          card.rule.toUpperCase().includes(upper),
      );
    }

    // preserve order of validSetIds (newest first)
    return cards.sort(
      (a, b) =>
        validSetIds.indexOf(a.setId as string) -
        validSetIds.indexOf(b.setId as string),
    );
  }, [selectedExpansionIds, searchText]);
}

function Library() {
  const isMobile = useBreakpoint("mobile");
  const [selectedExpansionIds, setSelectedExpansionIds] =
    useState<string[]>(validSetIds);
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [zoomedCard, setZoomedCard] = useState<{
    card: Card;
    rect: DOMRect;
  } | null>(null);
  const [zoomAnimating, setZoomAnimating] = useState(false);
  const handleCardClick = useCallback((card: Card, el: HTMLElement) => {
    setZoomedCard({ card, rect: el.getBoundingClientRect() });
  }, []);

  useEffect(() => {
    if (zoomedCard && !zoomAnimating) {
      requestAnimationFrame(() => setZoomAnimating(true));
    }
    // adding zoomAnimating here breaks animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomedCard]);

  const handleZoomClose = useCallback(() => {
    setZoomAnimating(false);
    setTimeout(() => setZoomedCard(null), 300);
  }, []);

  const filteredCards = useLibraryCards(selectedExpansionIds, searchText);

  const cardsBySet = useMemo(() => {
    const grouped = new Map<string, Card[]>();
    for (const card of filteredCards) {
      const key = card.setId as string;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(card);
    }
    return Array.from(grouped.entries()).map(([setId, cards]) => ({
      setId,
      cards,
    }));
  }, [filteredCards]);

  const expansionsPanel = (
    <GroupedExpansions
      validSetIds={validSetIds as never[]}
      selectedExpansions={selectedExpansionIds as never[]}
      onSelectionChanged={setSelectedExpansionIds as never}
    />
  );

  if (isMobile) {
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
            <div className="overflow-y-auto">{expansionsPanel}</div>
          </div>
        </Overlay>

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
      </div>
    );
  }

  return (
    <div className="flex-1 flex lg:grid lg:grid-cols-4 p-4">
      <div className="bg-gray-200 space-y-3">
        <section className="mx-2 mt-2">
          <DebouncedInput
            className="rounded h-10 bg-white box-border w-full py-1 px-2 outline-none border-2 focus:border-purple-700"
            placeholder="Search for text on a card"
            onChange={setSearchText}
          />
        </section>
        {expansionsPanel}
      </div>
      <div className="flex-1 lg:col-span-3 flex flex-col lg:px-2">
        {filteredCards.length === 0 ? (
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
                  <div className="flex h-[436px]" key={key}>
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
                          onClick={(e) =>
                            handleCardClick(card, e.currentTarget)
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
                ) : (
                  <></>
                )
              }
            </FixedVirtualizedList>
          </div>
        )}
      </div>
      {zoomedCard && (
        <ZoomedCard
          {...zoomedCard}
          onClose={() => handleZoomClose()}
          isZoomAnimating={zoomAnimating}
        />
      )}
    </div>
  );
}

export default Library;

import DeckIcon from "@icons/deck.svg?react";
import WarbandIcon from "@icons/warband.svg?react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAllSetsValidForFormat,
  NEMESIS_FORMAT,
  wucards,
  wufactions,
  warbandsValidForOrganisedPlay,
} from "@fxdxpz/wudb";
import type { Card } from "@fxdxpz/wudb";
import { useBreakpoint } from "../../hooks/useMediaQuery";
import { LibraryDesktopView } from "./LibraryDesktopView";
import { LibraryMobileView } from "./LibraryMobileView";
import type { Warband } from "../../shared/components/WarbandPicker";

const validSets = getAllSetsValidForFormat(NEMESIS_FORMAT);
const validSetIds = validSets.map((s) => s.id as string);
const universalFactionId = wufactions["u"].id;

const playableWarbands = warbandsValidForOrganisedPlay.filter(
  (f) => f.id !== universalFactionId,
);

const TABS = [
  { name: "Cards", Icon: DeckIcon },
  { name: "Warbands", Icon: WarbandIcon },
];

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

    return cards.sort(
      (a, b) =>
        validSetIds.indexOf(a.setId as string) -
        validSetIds.indexOf(b.setId as string),
    );
  }, [selectedExpansionIds, searchText]);
}

function Library() {
  const isMobile = useBreakpoint("mobile");
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [selectedExpansionIds, setSelectedExpansionIds] =
    useState<string[]>(validSetIds);
  const [searchText, setSearchText] = useState("");
  const [selectedFaction, setSelectedFaction] = useState<Warband>(
    playableWarbands[0],
  );
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

  if (isMobile) {
    return (
      <LibraryMobileView
        validSetIds={validSetIds}
        selectedExpansionIds={selectedExpansionIds}
        setSelectedExpansionIds={setSelectedExpansionIds}
        searchText={searchText}
        setSearchText={setSearchText}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        cardsBySet={cardsBySet}
        filteredCards={filteredCards}
        activeTabIndex={activeTabIndex}
        setActiveTabIndex={setActiveTabIndex}
        tabs={TABS}
        selectedFaction={selectedFaction}
        setSelectedFaction={setSelectedFaction}
        playableWarbands={playableWarbands}
      />
    );
  }

  return (
    <LibraryDesktopView
      validSetIds={validSetIds}
      selectedExpansionIds={selectedExpansionIds}
      setSelectedExpansionIds={setSelectedExpansionIds}
      setSearchText={setSearchText}
      filteredCards={filteredCards}
      activeTabIndex={activeTabIndex}
      setActiveTabIndex={setActiveTabIndex}
      tabs={TABS}
      zoomedCard={zoomedCard}
      zoomAnimating={zoomAnimating}
      onCardClick={handleCardClick}
      onZoomClose={handleZoomClose}
      selectedFaction={selectedFaction}
      setSelectedFaction={setSelectedFaction}
      playableWarbands={playableWarbands}
    />
  );
}

export default Library;

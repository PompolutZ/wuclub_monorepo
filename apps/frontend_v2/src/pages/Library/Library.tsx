import DeckIcon from "@icons/deck.svg?react";
import WarbandIcon from "@icons/warband.svg?react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAllSetsValidForFormat,
  getSetById,
  getSetNameById,
  NEMESIS_FORMAT,
  wucards,
  wufactions,
  warbandsValidForOrganisedPlay,
} from "@fxdxpz/wudb";
import type { Card, SetId } from "@fxdxpz/wudb";
import { useBreakpoint } from "../../hooks/useMediaQuery";
import { LibraryDesktopView } from "./LibraryDesktopView";
import { LibraryMobileView } from "./LibraryMobileView";
import { useLibrarySearchParams } from "./useLibrarySearchParams";

const validSets = getAllSetsValidForFormat(NEMESIS_FORMAT);
const validSetIds = validSets.map((s) => s.id);

const CARDS_PER_ROW = 5;

export type VirtualRow =
  | {
      type: "header";
      setId: string;
      setName: string;
      displayName: string;
      count: number;
    }
  | { type: "cardRow"; cards: Card[] };
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
  const {
    activeTabIndex,
    setActiveTabIndex,
    selectedExpansionIds,
    setSelectedExpansionIds,
    selectedFaction,
    setSelectedFaction,
  } = useLibrarySearchParams({ validSetIds, playableWarbands });
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

  const handleExpansionToggle = useCallback(
    (setId: SetId) => {
      const sid = setId as string;
      if (selectedExpansionIds.length === validSetIds.length) {
        setSelectedExpansionIds([sid]);
      } else if (
        selectedExpansionIds.length === 1 &&
        selectedExpansionIds[0] === sid
      ) {
        setSelectedExpansionIds(validSetIds);
      } else {
        const isSelected = selectedExpansionIds.includes(sid);
        setSelectedExpansionIds(
          isSelected
            ? selectedExpansionIds.filter((id) => id !== sid)
            : [...selectedExpansionIds, sid],
        );
      }
    },
    [selectedExpansionIds, setSelectedExpansionIds],
  );

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

  const virtualRows = useMemo((): VirtualRow[] => {
    const rows: VirtualRow[] = [];
    for (const { setId, cards } of cardsBySet) {
      const set = getSetById(setId as SetId);
      rows.push({
        type: "header",
        setId,
        setName: getSetNameById(setId as SetId) ?? setId,
        displayName: set?.displayName ?? setId,
        count: cards.length,
      });
      for (let i = 0; i < cards.length; i += CARDS_PER_ROW) {
        rows.push({
          type: "cardRow",
          cards: cards.slice(i, i + CARDS_PER_ROW),
        });
      }
    }
    return rows;
  }, [cardsBySet]);

  const stickyIndices = useMemo(
    () => virtualRows.flatMap((r, i) => (r.type === "header" ? [i] : [])),
    [virtualRows],
  );

  if (isMobile) {
    return (
      <LibraryMobileView
        validSets={validSets}
        selectedExpansionIds={selectedExpansionIds}
        onExpansionToggle={handleExpansionToggle}
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
      validSets={validSets}
      selectedExpansionIds={selectedExpansionIds}
      onExpansionToggle={handleExpansionToggle}
      setSearchText={setSearchText}
      virtualRows={virtualRows}
      stickyIndices={stickyIndices}
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

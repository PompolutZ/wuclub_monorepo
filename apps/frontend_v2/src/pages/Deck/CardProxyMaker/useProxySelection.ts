import { useState } from "react";
import type { Card } from "../../../data/wudb/types";

interface UseProxySelectionProps {
  cards: Card[];
  factionId: string;
  fighters: string[];
  plotCards: string[];
  onExit: () => void;
}

export const useProxySelection = ({
  cards,
  fighters,
  plotCards,
  onExit,
}: UseProxySelectionProps) => {
  const [selectedCardIds, setSelectedCardIds] = useState(() => cards.map((c) => c.id));
  const [selectedFighters, setSelectedFighters] = useState(fighters);
  const [selectedPlotCards, setSelectedPlotCards] = useState(plotCards);

  const handleDownload = async () => {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm" });
    const w = 64.5;
    const h = 89.9;

    const cardsToPrint = cards.filter((card) => selectedCardIds.includes(card.id));

    const pages = [...cardsToPrint, ...selectedPlotCards].reduce<Array<Array<Card | string>>>(
      (acc, el, index, array) => {
        if (index % 9 === 0) acc.push(array.slice(index, index + 9));
        return acc;
      },
      [],
    );

    const fighterPages = selectedFighters.reduce<string[][]>(
      (acc, el, index, array) => {
        if (index % 3 === 0) acc.push(array.slice(index, index + 3));
        return acc;
      },
      [],
    );

    for (const [pageIdx, page] of pages.entries()) {
      if (pageIdx > 0) doc.addPage();
      let rowIdx = 0;
      let x = 0;
      let y = 0;
      let idx = 0;

      for (const c of page) {
        const id = typeof c === "string" ? c : c.id;
        doc.addImage(
          document.getElementById(`proxy ${id}`) as HTMLImageElement,
          "png",
          x, y, w, h, "", "SLOW",
        );
        x += w;
        idx += 1;
        if (idx % 3 === 0) {
          rowIdx += 1;
          x = 0;
          y = rowIdx * h + 3;
        }
      }
    }

    for (const page of fighterPages) {
      doc.addPage();
      let rowIdx = 0;
      let x = 3;
      let y = 3;

      for (const f of page) {
        doc.addImage(
          document.getElementById(`proxy ${f}`) as HTMLImageElement,
          "png", x, y, w, h, "", "SLOW",
        );
        x += w;
        doc.addImage(
          document.getElementById(`proxy ${f}-inspired`) as HTMLImageElement,
          "png", x, y, w, h, "", "SLOW",
        );
        rowIdx += 1;
        x = 3;
        y = rowIdx * h + 3;
      }
    }

    doc.save("cards.pdf");
    onExit();
  };

  const toggleCard = (cardId: string) => () => {
    setSelectedCardIds((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId],
    );
  };

  const toggleFighter = (fighter: string) => () => {
    setSelectedFighters((prev) =>
      prev.includes(fighter) ? prev.filter((f) => f !== fighter) : [...prev, fighter],
    );
  };

  const togglePlotCard = (card: string) => () => {
    setSelectedPlotCards((prev) =>
      prev.includes(card) ? prev.filter((c) => c !== card) : [...prev, card],
    );
  };

  const toggleAll = () => {
    if (
      selectedCardIds.length > 0 ||
      selectedFighters.length > 0 ||
      selectedPlotCards.length > 0
    ) {
      setSelectedCardIds([]);
      setSelectedFighters([]);
      setSelectedPlotCards([]);
    } else {
      setSelectedCardIds(cards.map(({ id }) => id));
      setSelectedFighters(fighters);
      setSelectedPlotCards(plotCards);
    }
  };

  const toggleWarband = () => {
    setSelectedFighters((prev) => (prev.length > 0 ? [] : fighters));
  };

  const togglePlotCards = () => {
    setSelectedPlotCards((prev) => (prev.length > 0 ? [] : plotCards));
  };

  return {
    selectedCardIds,
    selectedFighters,
    selectedPlotCards,
    handleDownload,
    toggleCard,
    toggleFighter,
    togglePlotCard,
    toggleAll,
    toggleWarband,
    togglePlotCards,
  };
};

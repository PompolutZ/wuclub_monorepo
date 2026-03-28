import {
  factionMembers,
  setHasPlot
} from "@wudb/index";
import { useState } from "react";
import { getCardPathByCardId } from "../../utils/helpers";

const checkDeckHasPlots = (faction, sets) => {
  return (
    sets.some((setId) => setHasPlot(setId))
  );
};

const getPlotKeywords = (faction, sets) => {
  if (!checkDeckHasPlots(faction, sets)) return [];

  // const plotInfos = Object.values(plots);

  // return plotInfos.reduce((keywords, plot) => {
  //   const factionWithPlot =
  //     plot.connection === "Warband" && plot.name === faction;
  //   const setWithPlot = plot.connection === "Set" && sets.includes(plot.id);

  //   return factionWithPlot || setWithPlot ? [...keywords, plot] : keywords;
  // }, []);
};

const CardProxyMaker = ({ cards = [], factionId, onExit }) => {
  const [selectedCardIds, setSelectedCardIds] = useState(
    cards.map((c) => c.id),
  );
  const fighters = factionMembers[factionId] ?? [];
  const hasWarband = fighters.length > 0;
  const [selectedFighters, setSelectedFighters] = useState(fighters);

  const plotCards = (
    getPlotKeywords(
      factionId,
      cards.map((card) => card.setId),
    ) ?? []
  ).flatMap((plot) => plot.asset ?? plot.cards.map(({ asset }) => asset));
  const [selectedPlotCards, setSelectedPlotCards] = useState(plotCards);
  const handleDownload = async () => {
    const { default: jsPDF } = await import("jspdf");
    let doc = new jsPDF({
      unit: "mm",
    });

    const w = 64.5;
    const h = 89.9;

    const cardsToPrint = cards.filter((card) =>
      selectedCardIds.includes(card.id),
    );

    const pages = [...cardsToPrint, ...selectedPlotCards].reduce(
      (acc, el, index, array) => {
        if (index % 9 === 0) {
          acc.push(array.slice(index, index + 9));
        }
        return acc;
      },
      [],
    );

    const fighterPages = selectedFighters.reduce((acc, el, index, array) => {
      if (index % 3 === 0) {
        acc.push(array.slice(index, index + 3));
      }

      return acc;
    }, []);

    for (let page of pages) {
      {
        const index = pages.indexOf(page);
        if (index > 0) {
          doc.addPage();
        }
      }

      let rowIdx = 0;
      let x = 0;
      let y = 0;
      let idx = 0;

      for (let c of page) {
        doc.addImage(
          document.getElementById(`proxy ${c.id ?? c}`),
          "png",
          x,
          y,
          w,
          h,
          "",
          "SLOW",
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

    for (let page of fighterPages) {
      doc.addPage();

      let rowIdx = 0;
      let x = 3;
      let y = 3;

      for (let f of page) {
        doc.addImage(
          document.getElementById(`proxy ${f}`),
          "png",
          x,
          y,
          w,
          h,
          "",
          "SLOW",
        );
        x += w;
        doc.addImage(
          document.getElementById(`proxy ${f}-inspired`),
          "png",
          x,
          y,
          w,
          h,
          "",
          "SLOW",
        );

        rowIdx += 1;
        x = 3;
        y = rowIdx * h + 3;
      }
    }

    doc.save("cards.pdf");
    onExit();
  };

  const handleToggleCardSelected = (cardId) => () => {
    const selectedCardIndex = selectedCardIds.indexOf(cardId);

    if (selectedCardIndex >= 0) {
      setSelectedCardIds(selectedCardIds.filter((id) => id !== cardId));
    } else {
      setSelectedCardIds([...selectedCardIds, cardId]);
    }
  };

  const handleToggleFighterSelected = (fighter) => () => {
    const selectedCardIndex = selectedFighters.indexOf(fighter);

    if (selectedCardIndex >= 0) {
      setSelectedFighters(selectedFighters.filter((id) => id !== fighter));
    } else {
      setSelectedFighters([...selectedFighters, fighter]);
    }
  };

  const handleTogglePlotCard = (card) => () => {
    const selectedCardIndex = selectedPlotCards.indexOf(card);

    if (selectedCardIndex >= 0) {
      setSelectedPlotCards(selectedPlotCards.filter((id) => id !== card));
    } else {
      setSelectedPlotCards([...selectedPlotCards, card]);
    }
  };

  const toggleAll = () => {
    if (selectedCardIds.length > 0 || selectedFighters.length > 0) {
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
    if (selectedFighters.length > 0) {
      setSelectedFighters([]);
    } else {
      setSelectedFighters(fighters);
    }
  };

  const togglePlotCards = () => {
    if (selectedPlotCards.length > 0) {
      setSelectedPlotCards([]);
    } else {
      setSelectedPlotCards(plotCards);
    }
  };

  const cardImgClass = (selected) =>
    `w-full aspect-[64.5/89.9] object-cover cursor-pointer filter ${selected ? "grayscale-0" : "grayscale"}`;

  const gridClass = "grid grid-cols-3 md:grid-cols-6 gap-2";

  return (
    <div className="fixed inset-0 z-10 p-8 backdrop-blur">
      <div className="flex w-full h-full flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {plotCards.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-gray-700 mb-2">Plot Cards</h3>
              <div className={gridClass}>
                {plotCards.map((card) => (
                  <img
                    id={`proxy ${card}`}
                    key={card}
                    src={`/assets/plots/${card}.png`}
                    className={cardImgClass(selectedPlotCards.includes(card))}
                    onClick={handleTogglePlotCard(card)}
                  />
                ))}
              </div>
            </section>
          )}

          {hasWarband && (
            <section>
              <h3 className="text-sm font-bold text-gray-700 mb-2">Fighter Cards</h3>
              <div className={gridClass}>
                {fighters.map((fighter, index) => (
                  <>
                    <img
                      id={`proxy ${fighter}`}
                      key={fighter}
                      src={`/assets/fighters/${factionId}/${factionId}-${index + 1}.png`}
                      className={cardImgClass(selectedFighters.includes(fighter))}
                      onClick={handleToggleFighterSelected(fighter)}
                    />
                    <img
                      id={`proxy ${fighter}-inspired`}
                      key={`${fighter}-inspired`}
                      src={`/assets/fighters/${factionId}/${factionId}-${index + 1}-inspired.png`}
                      className={cardImgClass(selectedFighters.includes(fighter))}
                      onClick={handleToggleFighterSelected(fighter)}
                    />
                  </>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="text-sm font-bold text-gray-700 mb-2">Deck Cards</h3>
            <div className={gridClass}>
              {cards.map((card) => (
                <img
                  id={`proxy ${card.id}`}
                  key={card.id}
                  src={getCardPathByCardId(card, "png")}
                  className={cardImgClass(selectedCardIds.includes(card.id))}
                  onClick={handleToggleCardSelected(card.id)}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="bg-gray-300 p-4 flex items-center gap-4">
          <button
            className="btn btn-purple cursor-pointer px-4 py-2 font-bold"
            onClick={handleDownload}
          >
            Download
          </button>
          <button
            className="btn btn-purple cursor-pointer px-4 py-2 font-bold"
            onClick={toggleAll}
          >
            Toggle All
          </button>
          {hasWarband && (
            <button
              className="btn btn-purple cursor-pointer px-4 py-2 font-bold"
              onClick={toggleWarband}
            >
              Toggle Warband
            </button>
          )}
          {plotCards.length > 0 && (
            <button
              className="btn btn-purple cursor-pointer px-4 py-2 font-bold"
              onClick={togglePlotCards}
            >
              Toggle Plot Cards
            </button>
          )}
          <div className="text-sm text-gray-700 flex items-center gap-2">
            <span>{selectedCardIds.length}/{cards.length} deck cards</span>
            {hasWarband && (
              <span>· {selectedFighters.length}/{fighters.length} fighters</span>
            )}
            {plotCards.length > 0 && (
              <span>· {selectedPlotCards.length}/{plotCards.length} plot cards</span>
            )}
          </div>
          <button
            className="ml-auto btn btn-purple cursor-pointer px-4 py-2 font-bold"
            onClick={onExit}
          >
            Quit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProxyMaker;

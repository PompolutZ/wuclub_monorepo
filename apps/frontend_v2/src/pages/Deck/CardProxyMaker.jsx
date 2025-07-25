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
  const [selectedFighters, setSelectedFighters] = useState(
    factionMembers[factionId],
  );

  const plotCards = (
    getPlotKeywords(
      factionId,
      cards.map((card) => card.setId),
    ) ?? []
  ).flatMap((plot) => plot.asset ?? plot.cards.map(({ asset }) => asset));
  const [selectedPlotCards, setSelectedPlotCards] = useState(plotCards);
  const totalProxies =
    selectedCardIds.length + selectedFighters.length + selectedPlotCards.length;

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
      setSelectedFighters(factionMembers[factionId]);
      setSelectedPlotCards(plotCards);
    }
  };

  const toggleWarband = () => {
    if (selectedFighters.length > 0) {
      setSelectedFighters([]);
    } else {
      setSelectedFighters(factionMembers[factionId]);
    }
  };

  const togglePlotCards = () => {
    if (selectedPlotCards.length > 0) {
      setSelectedPlotCards([]);
    } else {
      setSelectedPlotCards(plotCards);
    }
  };

  return (
    <div className="fixed inset-0 z-10 p-8 backdrop-blur">
      <div className="flex w-full h-full flex-col">
        <div className="flex-1 overflow-y-auto grid grid-cols-6 gap-y-2 p-4">
          {plotCards.map((card) => (
            <img
              id={`proxy ${card}`}
              key={card}
              src={`/assets/plots/${card}.png`}
              className={`w-[64.5mm] h-[89.9mm] filter ${
                selectedPlotCards.includes(card) ? "grayscale-0" : "grayscale"
              }`}
              onClick={handleTogglePlotCard(card)}
            />
          ))}
          {factionMembers[factionId].map((fighter, index) => (
            <>
              <img
                id={`proxy ${fighter}`}
                key={fighter}
                src={`/assets/fighters/${factionId}/${factionId}-${
                  index + 1
                }.png`}
                className={`w-[64.5mm] h-[89.9mm] filter ${
                  selectedFighters.includes(fighter)
                    ? "grayscale-0"
                    : "grayscale"
                }`}
                onClick={handleToggleFighterSelected(fighter)}
              />
              <img
                id={`proxy ${fighter}-inspired`}
                key={`${fighter}-inspired`}
                src={`/assets/fighters/${factionId}/${factionId}-${
                  index + 1
                }-inspired.png`}
                className={`w-[64.5mm] h-[89.9mm] filter ${
                  selectedFighters.includes(fighter)
                    ? "grayscale-0"
                    : "grayscale"
                }`}
                onClick={handleToggleFighterSelected(fighter)}
              />
            </>
          ))}

          {cards.map((card) => (
            <img
              id={`proxy ${card.id}`}
              key={card.id}
              src={getCardPathByCardId(card.id, "png")}
              className={`w-[64.5mm] h-[89.9mm] filter ${
                selectedCardIds.includes(card.id) ? "grayscale-0" : "grayscale"
              }`}
              onClick={handleToggleCardSelected(card.id)}
            />
          ))}
        </div>
        <div className="bg-gray-300 p-4 flex items-center">
          <button
            className="btn btn-purple mr-8 cursor-pointer px-4 py-2 font-bold"
            onClick={handleDownload}
          >
            Download
          </button>
          <button
            className="btn btn-purple mr-8 cursor-pointer px-4 py-2 font-bold"
            onClick={toggleAll}
          >
            Toggle All
          </button>
          <button
            className="btn btn-purple mr-8 cursor-pointer px-4 py-2 font-bold"
            onClick={toggleWarband}
          >
            Toggle Warband
          </button>
          <button
            className="btn btn-purple mr-8 cursor-pointer px-4 py-2 font-bold"
            onClick={togglePlotCards}
          >
            Toggle Plot cards
          </button>
          <div>
            Total proxy cards selected{" "}
            <span className="font-bold">{totalProxies}</span>
          </div>
          <button
            className="ml-auto btn btn-purple mr-8 cursor-pointer px-4 py-2 font-bold"
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

import { useCallback, useState } from "react";
import AnimateHeight from "react-animate-height";
import CardRule from "../../../../atoms/CardRule";
import ObjectiveScoreTypeIcon from "../../../../components/ObjectiveScoreTypeIcon";
import GloryIcon from "@icons/wu-glory.svg?react";
import {
  getSetNameById,
  NEMESIS_FORMAT,
  RIVALS_DECK_CARDS_TOTAL,
} from "../../../../data/wudb/index";
import CardImage from "../../../../shared/components/CardImage";
import { ExpansionPicture } from "../../../../shared/components/ExpansionPicture";
import { pickCardColor2 } from "../../../../utils/functions";
import type { DeckCard } from "../types";

const idToPrintId = (id: string) => (
  <>
    <span className="font-bold">{`${id}`.slice(-3)}</span>
    <span>/{RIVALS_DECK_CARDS_TOTAL}</span>
  </>
);

export function CardAsText({ card }: { card: DeckCard }) {
  const [expanded, setExpanded] = useState(false);
  const [useTextFallback, setUseTextFallback] = useState(false);
  const animateHeight = expanded ? "auto" : 0;

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return (
    <>
      <div
        className="flex items-center p-2 rounded cursor-pointer space-x-1 transform transition-all sm:hover:bg-gray-300 sm:hover:shadow-sm sm:hover:scale-105"
        onClick={toggleExpanded}
      >
        <ExpansionPicture className="w-8 h-8" setName={getSetNameById(card.setId)} />
        <h3
          className="cursor-pointer flex-1 inline-block"
          style={{ color: pickCardColor2(card.id, NEMESIS_FORMAT) }}
        >
          {card.name}
        </h3>
        <div className="flex items-center">
          {card.scoreType && (
            <ObjectiveScoreTypeIcon
              type={card.scoreType}
              style={{ width: ".8rem", height: ".8rem" }}
            />
          )}
          {card.glory && (
            <div className="flex items-center font-bold ml-1">
              <GloryIcon className={`${card.type === "Upgrade" ? "bg-gray-400" : "bg-objective-gold"} rounded-full w-3 h-3 fill-current mr-1`} />
              {card.glory}
            </div>
          )}
        </div>
        <div className="flex items-center">
          <div className="ml-auto flex items-center text-xs text-gray-700">
            <div>(</div>
            {idToPrintId(card.id)}
            <div>)</div>
          </div>
        </div>
      </div>
      <AnimateHeight height={animateHeight} duration={250} easing="ease-out">
        {useTextFallback ? (
          <CardRule rule={card.rule} glory={card.glory} />
        ) : (
          <CardImage
            onError={() => setUseTextFallback(true)}
            onLoad={() => setUseTextFallback(false)}
            className="w-full mx-auto my-2 rounded-lg shadow-md sm:max-w-xs"
            id={card.id}
            alt={card.name}
          />
        )}
      </AnimateHeight>
    </>
  );
}

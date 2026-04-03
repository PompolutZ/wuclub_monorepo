import { useCallback, useState } from "react";
import AnimateHeight from "react-animate-height";
import CardRule from "../../../../atoms/CardRule";
import {
  NEMESIS_FORMAT,
} from "../../../../data/wudb/index";
import CardImage from "../../../../shared/components/CardImage";
import CardRow from "../../../../shared/components/CardRow";
import { pickCardColor2 } from "../../../../utils/functions";
import type { DeckCard } from "../types";

export function CardAsText({ card, isAlternate }: { card: DeckCard; isAlternate?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [useTextFallback, setUseTextFallback] = useState(false);
  const animateHeight = expanded ? "auto" : 0;

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return (
    <>
      <CardRow
        card={card}
        onClick={toggleExpanded}
        className={`rounded transform transition-all sm:hover:bg-gray-300 sm:hover:shadow-sm sm:hover:scale-105 ${isAlternate ? "bg-purple-100" : "bg-white"}`}
        nameStyle={{ color: pickCardColor2(card.id, NEMESIS_FORMAT) }}
      />
      <AnimateHeight height={animateHeight} duration={250} easing="ease-out">
        {useTextFallback ? (
          <CardRule rule={card.rule} glory={card.glory ?? undefined} />
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

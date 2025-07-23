import { SetIcon } from "@/shared/components/SetIcon";
import LockIcon from "@icons/lock.svg?react";
import ForsakenIcon from "@icons/no-symbol.svg?react";
import { useState } from "react";
import AnimateHeight from "react-animate-height";
import CardRule from "../../../../atoms/CardRule";
import ObjectiveScoreTypeIcon from "../../../../components/ObjectiveScoreTypeIcon";
import {
  CHAMPIONSHIP_FORMAT,
  getSetById,
  getSetNameById,
  RIVALS_DECK_CARDS_TOTAL,
  validateCardForPlayFormat,
} from "../../../../data/wudb/index";
import CardImage from "../../../../shared/components/CardImage";
import { pickCardColor2 } from "../../../../utils/functions";
import { ExpansionPicture } from "../../../../shared/components/ExpansionPicture";

const idToPrintId = (id) => {
  return (
    <>
      <span className="font-bold">{`${id}`.slice(-3)}</span>
      <span>/{RIVALS_DECK_CARDS_TOTAL}</span>
    </>
  );
};

function CardImageOrText({ useTextFallback, image, fallback }) {
  return useTextFallback ? fallback : image;
}

function Expandable({ animateHeight, children }) {
  return (
    <AnimateHeight height={animateHeight} duration={250} easing="ease-out">
      {children}
    </AnimateHeight>
  );
}

const CardAsImage = ({ card }) => {
  // const [, isForsaken, isRestricted] = validateCardForPlayFormat(
  //   id,
  //   CHAMPIONSHIP_FORMAT,
  // );
  const set = getSetById(card.setId);
  return (
    <div className="relative m-2 w-56 flex flex-col">
      <div className="relative">
        <CardImage
          alt={card.name}
          id={card.id}
          // className={`shadow-lg rounded-2xl ${
          //   isForsaken
          //     ? "shadow-red-500"
          //     : isRestricted
          //       ? "shadow-objective-gold"
          //       : ""
          // }`}
          className={`shadow-lg rounded-2xl`}
        />
        {/* {isForsaken && (
          <ForsakenIcon className="text-red-500/40 stroke-current w-50 h-50 absolute inset-0 m-auto" />
        )}

        {isRestricted && (
          <LockIcon className="text-objective-gold/40 stroke-current w-50 h-50 absolute inset-0 m-auto" />
        )} */}
      </div>

      <div className="space-y-2 mt-4">
        <span className="inline-block text-sm text-gray-700">Found in: </span>
        <div className="flex space-x-2 items-center">
          <ExpansionPicture className="w-6 h-6" setName={set.name} />
          <span className="inline-block text-sm">
            {set.displayName}
          </span>
        </div>
      </div>
    </div>
  );
};

const CardAsText = ({ card, cardId }) => {
  const [expanded, setExpanded] = useState(false);
  const [useTextFallback, setUseTextFallback] = useState(false);
  const animateHeight = expanded ? "auto" : 0;

  return (
    <>
      <div
        className="flex items-center p-2 rounded cursor-pointer space-x-1 transform transition-all sm:hover:bg-gray-300 sm:hover:shadow-sm sm:hover:scale-105"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <ExpansionPicture className="w-8 h-8" setName={getSetNameById(card.setId)} />
        <h3
          className="cursor-pointer flex-1 inline-block"
          style={{
            color: pickCardColor2(cardId, CHAMPIONSHIP_FORMAT),
          }}
        >
          {card.name}
        </h3>
        <div className="flex items-center">
          {card.scoreType && (
            <ObjectiveScoreTypeIcon
              type={card.scoreType}
              style={{
                width: ".8rem",
                height: ".8rem",
              }}
            />
          )}
          {card.glory && (
            <span className="text-xs font-bold">({card.glory})</span>
          )}
        </div>
        <div className="flex items-center">
          <div className="ml-auto flex items-center text-xs text-gray-700">
            <div>(</div>
            {idToPrintId(cardId)}
            <div>)</div>
          </div>
        </div>
      </div>
      <Expandable animateHeight={animateHeight}>
        <CardImageOrText
          useTextFallback={useTextFallback}
          image={
            <CardImage
              onError={() => setUseTextFallback(true)}
              onLoad={() => setUseTextFallback(false)}
              className="w-full mx-auto my-2 rounded-lg shadow-md sm:max-w-xs"
              id={card.id}
              alt={card.name}
            />
          }
          fallback={<CardRule rule={card.rule} glory={card.glory} />}
        />
      </Expandable>
    </>
  );
};

const Card = ({ card, asImage }) => {
  return asImage ? (
    <CardAsImage card={card} />
  ) : (
    <CardAsText card={card} cardId={card.id} />
  );
};

export default Card;

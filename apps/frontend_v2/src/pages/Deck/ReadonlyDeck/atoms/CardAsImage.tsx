import LockIcon from "@icons/lock.svg?react";
import ForsakenIcon from "@icons/no-symbol.svg?react";
import { getSetById, validateCardForPlayFormat } from "../../../../data/wudb/index";
import CardImage from "../../../../shared/components/CardImage";
import { ExpansionPicture } from "../../../../shared/components/ExpansionPicture";
import type { DeckCard } from "../types";

export function CardAsImage({ card }: { card: DeckCard }) {
  const [, isForsaken, isRestricted] = validateCardForPlayFormat(card);
  const set = getSetById(card.setId);

  return (
    <div className="relative m-2 w-56 flex flex-col">
      <div className="relative">
        <CardImage
          alt={card.name}
          id={card.id}
          className={`shadow-lg rounded-2xl ${
            isForsaken
              ? "shadow-red-500"
              : isRestricted
                ? "shadow-objective-gold"
                : ""
          }`}
        />
        {isForsaken && (
          <ForsakenIcon className="text-red-500/40 stroke-current w-50 h-50 absolute inset-0 m-auto" />
        )}
        {isRestricted && (
          <LockIcon className="text-objective-gold/40 stroke-current w-50 h-50 absolute inset-0 m-auto" />
        )}
      </div>

      <div className="space-y-2 mt-4">
        <span className="inline-block text-sm text-gray-700">Found in: </span>
        <div className="flex space-x-2 items-center">
          <ExpansionPicture className="w-6 h-6" setName={set.name} />
          <span className="inline-block text-sm">{set.displayName}</span>
        </div>
      </div>
    </div>
  );
}

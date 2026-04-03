import { memo, type CSSProperties } from "react";
import LockIcon from "@icons/lock.svg?react";
import NotInterestedIcon from "@icons/no-symbol.svg?react";
import GloryIcon from "@icons/wu-glory.svg?react";
import ObjectiveScoreTypeIcon from "../../components/ObjectiveScoreTypeIcon";
import {
  getCardNumberFromId,
  getSetNameById,
  RIVALS_DECK_CARDS_TOTAL,
} from "../../data/wudb";
import type { ScoreType } from "../../data/wudb";
import { ExpansionPicture } from "./ExpansionPicture";

interface CardRowProps {
  card: {
    id: string;
    name: string;
    type: string;
    setId: string;
    scoreType: ScoreType;
    glory: number | null;
  };
  onClick?: () => void;
  className?: string;
  isRestricted?: boolean;
  isBanned?: boolean;
  nameStyle?: CSSProperties;
}

const CardRow = memo(function CardRow({ card, onClick, className, isRestricted, isBanned, nameStyle }: CardRowProps) {
  const { id, name, type, setId, scoreType, glory } = card;
  const setName = getSetNameById(setId as never);

  return (
    <div
      className={`flex items-center ${onClick ? "cursor-pointer" : ""} ${className ?? ""}`}
      onClick={onClick}
    >
      <div className="flex items-center mx-2">
        <img
          className="w-8 h-8"
          alt={type}
          src={`/assets/icons/${type.toLowerCase()}-icon.png`}
        />
        <div className="relative -translate-x-2">
          <ExpansionPicture
            className={`w-8 h-8 ${isRestricted || isBanned ? "opacity-50" : ""}`}
            setName={setName}
          />
          {isRestricted && (
            <LockIcon className="absolute stroke-2 stroke-yellow-600 stroke-[4px] w-8 h-8 top-1/2 -mt-4 left-1/2 -ml-4" />
          )}
          {isBanned && (
            <NotInterestedIcon className="absolute stroke-red-700 stroke-[4px] w-8 h-8 top-1/2 -mt-4 left-1/2 -ml-4" />
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0 self-start py-1">
        <div className="flex items-center">
          {scoreType && scoreType !== "-" && (
            <ObjectiveScoreTypeIcon
              type={scoreType}
              style={{ width: "1rem", height: "1rem" }}
            />
          )}
          <h6
            className={`truncate ${scoreType && scoreType !== "-" ? "ml-2" : ""}`}
            style={nameStyle}
          >
            {name}
          </h6>
        </div>
        <div className="flex items-center">
          {glory && (
            <div className="flex items-center font-bold mx-2">
              <GloryIcon
                className={`${type === "Upgrade" ? "bg-gray-400" : "bg-objective-gold"} rounded-full w-3 h-3 fill-current mr-1`}
              />
              {glory}
            </div>
          )}
          <span className="font-bold text-xs text-gray-500">
            {`${getCardNumberFromId(id)}/${RIVALS_DECK_CARDS_TOTAL}`}
          </span>
        </div>
      </div>
    </div>
  );
});

export default CardRow;

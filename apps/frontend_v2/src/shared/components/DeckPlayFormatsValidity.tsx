import {
  ACTIVE_FORMATS,
  checkCardIsObjective,
  checkCardIsPloy,
  checkCardIsUpgrade,
  validateDeckForPlayFormat,
} from "@wudb";
import { Card } from "../../data/wudb/types";
import { PlayFormatPicture } from "./PlayFormatPicture";

export const DeckPlayFormatsValidity = ({ cards }: { cards: Card[] }) => {
  const cardsByType = {
    objectives: cards.filter(checkCardIsObjective),
    gambits: cards.filter(checkCardIsPloy),
    upgrades: cards.filter(checkCardIsUpgrade),
  };
  const allValidFormats = ACTIVE_FORMATS.map(
    (format: (typeof ACTIVE_FORMATS)[number]) => [
      format,
      ...validateDeckForPlayFormat(cardsByType, format),
    ],
  ).filter(([, isValid]) => isValid);

  if (allValidFormats.length === 0) {
    return <div className="text-red-500 text-xs mt-4">Not Valid :(</div>;
  }

  return (
    <div className="flex items-center justify-center relative h-7 w-6">
      {allValidFormats.map(
        ([format], i: number) => (
          <div
            key={format as typeof ACTIVE_FORMATS[number]}
            className={`absolute w-6 h-7`}
            style={{
              zIndex: allValidFormats.length - i,
              left: `${i * 20}px`,
              marginLeft: `-${allValidFormats.length * 5}px`,
            }}
          >
            <PlayFormatPicture format={format as typeof ACTIVE_FORMATS[number]} size="sm" />
          </div>
        ),
      )}
    </div>
  );
};

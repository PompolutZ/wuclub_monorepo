import { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import GloryIcon from "@icons/wu-glory.svg?react";
import ObjectiveScoreTypeIcon from "../../components/ObjectiveScoreTypeIcon";
import {
  getCardById,
  getCardNumberFromId,
  getSetNameById,
  RIVALS_DECK_CARDS_TOTAL,
} from "../../data/wudb";
import { ModalPresenter } from "../../main";
import CardImage from "../../shared/components/CardImage";

interface LibraryCardRowProps {
  cardId: string;
  isAlternate: boolean;
}

const LibraryCardRow = memo(function LibraryCardRow({ cardId, isAlternate }: LibraryCardRowProps) {
  const [overlayIsVisible, setOverlayIsVisible] = useState(false);
  const card = getCardById(cardId as never);

  if (!card) return null;

  const { type, id, scoreType, glory, name, setId, rule } = card;

  return (
    <>
      <div
        className={`flex items-center cursor-pointer ${isAlternate ? "bg-purple-100" : "bg-white"}`}
        onClick={() => setOverlayIsVisible(true)}
      >
        <div className="mx-2">
          <img
            className="w-8 h-8"
            alt={`${getSetNameById(setId)}`}
            src={`/assets/icons/decks/${getSetNameById(setId)}.png`}
          />
        </div>
        <div className="flex-1 min-w-0 self-start py-1">
          <div className="flex items-center">
            {scoreType && scoreType !== "-" && (
              <ObjectiveScoreTypeIcon
                type={scoreType}
                style={{ width: "1rem", height: "1rem" }}
              />
            )}
            <h6 className={`truncate ${scoreType && scoreType !== "-" ? "ml-2" : ""}`}>
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
            <span className="font-bold text-xs text-gray-500">{`${getCardNumberFromId(id)}/${RIVALS_DECK_CARDS_TOTAL}`}</span>
          </div>
        </div>
      </div>
      {overlayIsVisible && (
        <ModalPresenter>
          <div
            className="fixed inset-0 z-10 cursor-pointer"
            onClick={() => setOverlayIsVisible(false)}
          >
            <div className="bg-black absolute inset-0 opacity-25" />
            <div className="absolute inset-0 z-20 flex justify-center items-center">
              <div className="w-4/5 lg:w-1/4">
                <div className="w-[300px] h-[420px] bg-purple-100 rounded-2xl border-4 border-gray-900 grid grid-cols-1 grid-rows-1">
                  <div className="py-4">
                    <h1 className="text-center text-xl font-bold">{name}</h1>
                    <div className="p-2">
                      {rule.split("\\n").map((paragraph, i) => (
                        <ReactMarkdown key={i}>{paragraph.trim()}</ReactMarkdown>
                      ))}
                      {glory && (
                        <div className="flex items-center justify-center space-x-2 mt-8">
                          {new Array(glory).fill(0).map((_, i) => (
                            <GloryIcon
                              key={i}
                              className="bg-objective-gold rounded-full w-8 h-8 fill-current"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <CardImage
                    id={id}
                    className="rounded-lg row-start-1 row-end-2 col-start-1 col-end-2"
                    style={{ filter: "drop-shadow(0 0 10px black)" }}
                    alt={id}
                  />
                </div>
              </div>
            </div>
          </div>
        </ModalPresenter>
      )}
    </>
  );
});

export default LibraryCardRow;

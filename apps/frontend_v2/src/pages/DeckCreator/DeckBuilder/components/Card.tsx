import { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import GloryIcon from "@icons/wu-glory.svg?react";
import CloseIcon from "@icons/x.svg?react";
import { getCardById, validateCardForPlayFormat } from "../../../../data/wudb";
import { ModalPresenter } from "../../../../main";
import CardImage from "../../../../shared/components/CardImage";
import CardRow from "../../../../shared/components/CardRow";

interface CardInDeckProps {
  cardId: string;
  format: string;
  toggleCard: () => void;
  inDeck: boolean;
  isNameDuplicate?: boolean;
  ranking?: number;
  withAnimation?: boolean;
  isAlter?: boolean;
}

const CardInDeck = memo(
  ({
    cardId,
    format,
    toggleCard,
    inDeck,
    isNameDuplicate,
    ...props
  }: CardInDeckProps) => {
    const [overlayIsVisible, setOverlayIsVisible] = useState(false);
    const card = getCardById(cardId as never);
    const [, isBanned, isRestricted] = validateCardForPlayFormat(
      cardId as never,
      format as never,
    );

    if (!card) return null;

    const { id } = card;
    const isAddDisabled = isNameDuplicate && !inDeck;

    return (
      <>
        <div
          className={`flex items-center ${isNameDuplicate ? "grayscale opacity-60" : ""} ${
            isRestricted
              ? "bg-yellow-100"
              : isBanned
                ? "bg-red-100"
                : props.isAlter
                  ? "bg-purple-100"
                  : props.isAlter !== undefined
                    ? "bg-white"
                    : ""
          }`}
        >
          <CardRow
            card={card}
            onClick={() => setOverlayIsVisible(true)}
            className="flex-1"
            isRestricted={isRestricted}
            isBanned={isBanned}
          />
          <button
            className={`btn m-2 w-8 h-8 py-0 px-1 ${
              inDeck ? "btn-red" : "btn-purple"
            } ${isAddDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
            onClick={isAddDisabled ? undefined : toggleCard}
            disabled={isAddDisabled}
          >
            <CloseIcon
              className={`text-white stroke-current transform transition-transform duration-300 ${
                inDeck ? "rotate-0" : "rotate-45"
              }`}
            />
          </button>
        </div>
        {overlayIsVisible && (
          <ModalPresenter>
            <div
              className="fixed inset-0 z-10 cursor-pointer"
              onClick={() => setOverlayIsVisible(false)}
            >
              <div className="bg-black absolute inset-0 opacity-25"></div>
              <div className="absolute inset-0 z-20 flex justify-center items-center">
                <div className="w-4/5 lg:w-1/4">
                  <div className="w-[300px] h-[420px] bg-purple-100 rounded-2xl border-4 border-gray-900 grid grid-cols-1 grid-rows-1">
                    <div className="py-4">
                      <h1 className="text-center text-xl font-bold">
                        {card.name}
                      </h1>
                      <div className="p-2">
                        {card.rule.split("\\n").map((paragraph, i) => (
                          <ReactMarkdown key={i}>
                            {paragraph.trim()}
                          </ReactMarkdown>
                        ))}
                        {card.glory && (
                          <div className="flex items-center justify-center space-x-2 mt-8">
                            {new Array(card.glory).fill(0).map((_, i) => (
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
  },
);

CardInDeck.displayName = "CardInDeck";

export default CardInDeck;

import { FactionDeckPicture } from "@components/FactionDeckPicture";
import { Deck } from "@fxdxpz/schema";
import { TrashIcon } from "lucide-react";
import { Link } from "react-router-dom";
import ScoringOverview from "../../atoms/ScoringOverview";
import SetsList from "../../atoms/SetsList";
import { VIEW_DECK } from "../../constants/routes";
import { checkCardIsObjective, getCardById } from "../../data/wudb";
import { DeckTitle } from "@/shared/components/DeckTitle";
import { PeopleIcon } from "@components/Icons";

type Props = {
  onDelete: (id: string) => void;
  deck: Omit<Deck, "fuid">;
};

export const DeckLink = ({ onDelete, deck }: Props) => {
  const cards = deck.deck.map((x) => getCardById(x));
  const totalGlory = cards
    .filter(checkCardIsObjective)
    .reduce((total, { glory }) => (total += glory), 0);

  const objectiveSummary = cards.filter(checkCardIsObjective).reduce(
    (acc, c) => {
      acc[c.scoreType] += 1;
      return acc;
    },
    { Surge: 0, End: 0, Third: 0 },
  );

  return (
    <div className="flex items-center border-t border-gray-500 lg:w-1/3 lg:mx-auto my-2 py-2">
      <FactionDeckPicture faction={deck.faction} />

      <div className="flex-1 pl-2">
        <DeckTitle factionName={deck.faction} sets={deck.sets}>
          <Link
            className="text-xl"
            to={{
              pathname: `${VIEW_DECK}/${deck.deckId}`,
              state: {
                deck,
                canUpdateOrDelete: true,
              },
            }}
          >
            {deck.name}
          </Link>
        </DeckTitle>
        <div className="space-y-2">
          <div className="flex">
            <h3 className="text-sm font-bold text-gray-700">
              {new Date(deck.updatedutc).toLocaleDateString()}
            </h3>
            {!deck.private && (
              <div className="flex items-center text-purple-700 uppercase text-xs pl-2 font-bold space-x-2">
                <PeopleIcon className="w-4 h-4 stroke-current" />
                public
              </div>
            )}
          </div>
          <SetsList sets={deck.sets} />
          <ScoringOverview summary={objectiveSummary} glory={totalGlory} />
        </div>
      </div>
      <div className="pl-2">
        <button className="btn btn-red" onClick={() => onDelete(deck.deckId)}>
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

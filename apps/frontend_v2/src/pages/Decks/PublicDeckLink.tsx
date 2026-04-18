import { DeckTitle } from "@/shared/components/DeckTitle";
import { DeckPlayFormatsValidity } from "@components/DeckPlayFormatsValidity";
import { FactionDeckPicture } from "@components/FactionDeckPicture";
import { Link } from "@tanstack/react-router";
import ScoringOverview from "../../atoms/ScoringOverview";
import SetsList from "../../atoms/SetsList";
import { checkCardIsObjective, getCardById, Deck, SetId } from "@fxdxpz/wudb";

type PublicDeckLinkProps = {
  deck: Deck;
};

export default function PublicDeckLink({ deck }: PublicDeckLinkProps) {
  const { deck: cardIds, sets, faction, deckId, name, updatedutc } = deck;
  const cards = cardIds.map((x) => getCardById(x));
  const totalGlory = cards
    .filter(checkCardIsObjective)
    .reduce((total, { glory }) => (total += glory ?? 0), 0);

  const objectiveSummary = cards.filter(checkCardIsObjective).reduce(
    (acc, c) => {
      if (c.scoreType === "-") return acc;

      acc[c.scoreType] += 1;
      return acc;
    },
    { Surge: 0, End: 0, Third: 0 },
  );

  return (
    <div className="flex p-2 items-center border-gray-400 border-b last:border-none">
      <div className="flex flex-col items-center space-y-2 w-24">
        <FactionDeckPicture faction={faction} />
        <DeckPlayFormatsValidity cards={cards} />
      </div>
      <div className="flex-1 ml-8">
        <DeckTitle sets={sets}>
          <Link
            className="text-xl truncate hover:text-purple-700"
            to="/view/deck/$id"
            params={{ id: deckId }}
          >
            {name}
          </Link>
        </DeckTitle>

        <h3 className="text-xs text-gray-700">
          {new Date(updatedutc).toLocaleDateString()}
        </h3>
        <SetsList sets={sets as SetId[]} />
        <ScoringOverview summary={objectiveSummary} glory={totalGlory} />
      </div>
    </div>
  );
}

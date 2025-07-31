import { DeckTitle } from "@/shared/components/DeckTitle";
import { DeckPlayFormatsValidity } from "@components/DeckPlayFormatsValidity";
import { FactionDeckPicture } from "@components/FactionDeckPicture";
import { Link } from "react-router-dom";
import ScoringOverview from "../../atoms/ScoringOverview";
import SetsList from "../../atoms/SetsList";
import { VIEW_DECK } from "../../constants/routes";
import {
    checkCardIsObjective,
    getCardById,
} from "../../data/wudb";
import { Deck, SetId } from "../../data/wudb/types";

type PublicDeckLinkProps = {
    deck: Deck;
}

export default function PublicDeckLink({ deck }: PublicDeckLinkProps) {
    const { deck: cardIds, sets, faction, deckId, name, updatedutc  } = deck;
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
        { Surge: 0, End: 0, Third: 0 }
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
                        to={{
                            pathname: `${VIEW_DECK}/${deckId}`,
                            state: {
                                deck: {
                                    ...deck,
                                    id: deckId,
                                },
                                canUpdateOrDelete: false,
                            },
                        }}
                    >
                        {name}
                    </Link>
                </DeckTitle>

                <div className="flex space-x-1 items-baseline">
                    <h3 className="text-xs text-gray-700">
                        {new Date(updatedutc).toLocaleDateString()}
                    </h3>
                    {/* {getPlotKeywords(faction, sets).map(
                        (keyword) => (
                            <span
                                className="text-purple-700 font-bold"
                                key={keyword}
                            >
                                {keyword}
                            </span>
                        )
                    )} */}
                </div>
                <SetsList sets={sets as SetId[]} />
                <ScoringOverview
                    summary={objectiveSummary}
                    glory={totalGlory}
                />
            </div>
        </div>
    );
}

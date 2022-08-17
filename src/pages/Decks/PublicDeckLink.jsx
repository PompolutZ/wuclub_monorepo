import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { VIEW_DECK } from "../../constants/routes";
import {
    checkCardIsObjective,
    getCardById,
} from "../../data/wudb";
import ScoringOverview from "../../atoms/ScoringOverview";
import SetsList from "../../atoms/SetsList";
import { FactionDeckPicture } from "../../v2/components/FactionDeckPicture";

export default function PublicDeckLink({ ...props }) {
    const [cards, setCards] = useState([]);
    const [ userInfo ] = props.userInfo;

    useEffect(() => {
        const cards = props.cards.map((x) => getCardById(x));
        setCards(cards);
    }, [props.cards]);

    const totalGlory = useMemo(
        () =>
            cards
                .filter(checkCardIsObjective)
                .reduce((total, { glory }) => (total += glory), 0),
        [cards]
    );

    const objectiveSummary = useMemo(
        () =>
            cards.filter(checkCardIsObjective).reduce(
                (acc, c) => {
                    acc[c.scoreType] += 1;
                    return acc;
                },
                { Surge: 0, End: 0, Third: 0 }
            ),
        [cards]
    );

    return (
        <div className="flex items-center border-t border-gray-500 lg:w-1/3 lg:mx-auto my-2 py-2">
            <FactionDeckPicture faction={props.faction} size="w-12 h-12" />
            <div className="flex-1 pl-2">
                <Link
                    className="text-xl"
                    to={{
                        pathname: `${VIEW_DECK}/${props.deckId}`,
                        state: {
                            deck: {
                                ...props,
                                id: props.deckId
                            },
                            canUpdateOrDelete: false,
                        },
                    }}
                >
                    {props.name}
                </Link>
                <div>
                    <div className="flex gap-2 my-1">
                    <h3 className="text-sm font-bold text-gray-600">{userInfo ? userInfo.displayName : 'Anonymous'}</h3>
                    <h3 className="text-sm font-bold text-gray-700">{new Date(props.updatedutc).toLocaleDateString()}</h3>
                    </div>
                    <SetsList sets={props.sets} />
                    <ScoringOverview
                        summary={objectiveSummary}
                        glory={totalGlory}
                    />
                </div>
            </div>
        </div>
    );
}
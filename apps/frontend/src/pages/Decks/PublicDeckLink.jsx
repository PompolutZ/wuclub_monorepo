import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { VIEW_DECK } from "../../constants/routes";
import {
    checkCardIsObjective,
    getCardById,
    checkDeckHasPlots,
    plots,
} from "../../data/wudb";
import ScoringOverview from "../../atoms/ScoringOverview";
import SetsList from "../../atoms/SetsList";
import { FactionDeckPicture } from "@components/FactionDeckPicture";
import { DeckPlayFormatsValidity } from "@components/DeckPlayFormatsValidity";
import { DeckTitle } from "@components/DeckTitle";

const getPlotKeywords = (faction, sets) => {
    if (!checkDeckHasPlots(faction, sets)) return [];

    const plotInfos = Object.values(plots);

    return plotInfos.reduce((keywords, plot) => {
        const factionWithPlot =
            plot.connection === "Warband" && plot.name === faction;
        const setWithPlot = plot.connection === "Set" && sets.includes(plot.id);

        return factionWithPlot || setWithPlot
            ? [...keywords, plot.keyword]
            : keywords;
    }, []);
};

export default function PublicDeckLink({ ...props }) {
    const cards = props.cards.map((x) => getCardById(x));
    const totalGlory = cards
        .filter(checkCardIsObjective)
        .reduce((total, { glory }) => (total += glory), 0);

    const objectiveSummary = cards.filter(checkCardIsObjective).reduce(
        (acc, c) => {
            acc[c.scoreType] += 1;
            return acc;
        },
        { Surge: 0, End: 0, Third: 0 }
    );

    return (
        <div className="flex p-2 items-center border-gray-400 border-b last:border-none">
            <div className="flex flex-col items-center space-y-2 w-24">
                <FactionDeckPicture faction={props.faction} />
                <DeckPlayFormatsValidity cards={cards} />
            </div>
            <div className="flex-1 space-y-1 ml-8">
                <DeckTitle factionName={props.faction} sets={props.sets}>
                    <Link
                        className="text-xl truncate hover:text-purple-700"
                        to={{
                            pathname: `${VIEW_DECK}/${props.deckId}`,
                            state: {
                                deck: {
                                    ...props,
                                    id: props.deckId,
                                },
                                canUpdateOrDelete: false,
                            },
                        }}
                    >
                        {props.name}
                    </Link>
                </DeckTitle>

                <div className="flex space-x-1 items-baseline">
                    <h3 className="text-xs text-gray-700">
                        {new Date(props.updatedutc).toLocaleDateString()}
                    </h3>
                    {getPlotKeywords(props.faction, props.sets).map(
                        (keyword) => (
                            <span
                                className="text-purple-700 font-bold"
                                key={keyword}
                            >
                                {keyword}
                            </span>
                        )
                    )}
                </div>
                <SetsList sets={props.sets} />
                <ScoringOverview
                    summary={objectiveSummary}
                    glory={totalGlory}
                />
            </div>
        </div>
    );
}

import React, { useMemo, useState } from "react";
import {
    getAllSetsValidForFormat,
    NEMESIS_FORMAT,
    wucards
} from "../../data/wudb";
import { CardPicture } from "../../shared/components/CardPicture";
import { FixedVirtualizedList } from "../../shared/components/FixedVirtualizedList";
import { GroupedExpansions } from "../../shared/components/GrouppedExpansions";

function useFilteredCards(factions = [], expansions = []) {
    const [searchText, setSearchText] = useState("");
    const filteredCards = useMemo(() => {

        const cards = Object.values(wucards)
            .sort(
                (prev, next) => next.setId - prev.setId
            );
        const findText = searchText.toUpperCase();
        const filteredCards = cards.filter(
            (card) =>
                card.name.toUpperCase().includes(findText) ||
                card.rule.toUpperCase().includes(findText)
        );

        return filteredCards;
    }, [factions, expansions, searchText]);

    return [filteredCards, setSearchText];
}

function Library() {
    const cardsContainerRef = React.createRef();
    const validSetIds = getAllSetsValidForFormat(NEMESIS_FORMAT).map(
        (set) => set.id
    );
    const [selectedExpansions, setSelectedExpansions] = useState(validSetIds);
    const [filteredCards, findCardsWithText] = useFilteredCards(
        [], // selectedFactions
        selectedExpansions
    );

    return (
        <React.Fragment>
            <div className="flex-1 flex flex-col lg:grid lg:grid-cols-4 p-4">
                <div className={`bg-gray-200 space-y-3`}>
                    <section className="flex space-x-2 m-2">
                        <input
                            onChange={(e) => findCardsWithText(e.target.value)}
                            placeholder="Search for text on a card"
                            className="flex-1 px-3 py-2 w-full m-1border border-purple-300 focus:ring focus:ring-purple-500 focus:outline-none"
                        />
                    </section>

                    <GroupedExpansions
                        validSetIds={validSetIds}
                        selectedExpansions={selectedExpansions}
                        onSelectionChanged={setSelectedExpansions}
                    />
                </div>
                <div className="flex-1 lg:col-span-3 flex flex-col lg:px-2">
                    {filteredCards.length === 0 && (
                        <div className="flex-1 flex items-center justify-center text-gray-900 text-xl">
                            <div>
                                <img
                                    src="/assets/art/not-found.png"
                                    alt="No result matching filter."
                                />
                                Oops! Seems like there are no cards matching
                                your filters.
                            </div>
                        </div>
                    )}
                    <div className="flex-1 flex" ref={cardsContainerRef}>
                        {filteredCards.length > 0 && (
                            <FixedVirtualizedList
                                items={filteredCards}
                                variant="grid"
                            >
                                {(cards, { key }) => {
                                    return Array.isArray(cards) ? (
                                        <div
                                            className="flex h-[436px]"
                                            key={key}
                                        >
                                            {cards.map((card) => (
                                                <div
                                                    key={card.id}
                                                    className="flex-1 p-2 flex items-center justify-center"
                                                >
                                                        <CardPicture
                                                            card={card}
                                                        />
                                                </div>
                                            ))}
                                        </div>
                                    ) : null;
                                }}
                            </FixedVirtualizedList>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Library;

import React, { useMemo, useState } from "react";
import {
    CHAMPIONSHIP_FORMAT,
    getAllSetsValidForFormat,
    RELIC_FORMAT,
    wucards,
    wufactions,
} from "../../data/wudb";
import SectionTitle from "../../v2/components/SectionTitle";
import { DeckPlayFormatToggle } from "../../v2/components/DeckPlayFormatToggle";
import { DeckPlayFormatInfo } from "../../shared/components/DeckPlayFormatInfo";
import IconButton from "../../v2/components/IconButton";
import TogglesIcon from "@icons/sliders.svg?react";
import { sortByIdAsc } from "../../utils/sort";
import { GrouppedFactionsToggle } from "../../v2/components/GrouppedFactionsToggle";
import { GrouppedExpansions } from "../../v2/components/GrouppedExpansions";
import { FixedVirtualizedList } from "../../v2/components/FixedVirtualizedList";
import { getCardPathByCardId } from "../../utils/helpers";

function useFilteredCards(factions = [], expansions = []) {
    const [searchText, setSearchText] = useState("");
    const filteredCards = useMemo(() => {
        const includeUniversalCards = factions.includes(
            wufactions["Universal"].id
        );

        const cards = Object.values(wucards)
            .filter(
                (card) =>
                    (card.factionId > 1 && factions.includes(card.factionId)) ||
                    (includeUniversalCards &&
                        card.factionId === 1 &&
                        expansions.includes(card.setId))
            )
            .sort(
                (prev, next) =>
                    prev.factionId - next.factionId || next.setId - prev.setId
            );
        const findText = searchText.toUpperCase();
        return cards.filter(
            (card) =>
                card.name.toUpperCase().includes(findText) ||
                card.rule.toUpperCase().includes(findText)
        );
    }, [factions, expansions, searchText]);

    return [filteredCards, setSearchText];
}

function CardPicture({ name, id }) {
    return (
        <picture className="max-h-full max-w-full flex">
            <source
                type="image/webp"
                srcSet={getCardPathByCardId(id, "webp")}
            />
            <img
                className="relative object-contain cursor-pointer transform hover:scale-105 transition-all hover:z-10 filter hover:drop-shadow-lg"
                alt={name}
                src={getCardPathByCardId(id, "png")}
            />
        </picture>
    );
}

function Library() {
    const cardsContainerRef = React.createRef();
    const [selectedFormat, setSelectedFormat] = useState(CHAMPIONSHIP_FORMAT);
    const validSetIds = getAllSetsValidForFormat(selectedFormat).map(
        (set) => set.id
    );
    const sortedFactions = Object.values(wufactions).sort(sortByIdAsc);
    const [selectedFactions, setSelectedFactions] = useState(
        sortedFactions.map((f) => f.id)
    );
    const [selectedExpansions, setSelectedExpansions] = useState(validSetIds);
    const [filteredCards, findCardsWithText] = useFilteredCards(
        selectedFactions,
        selectedExpansions
    );
    const [showFilters, setShowFilters] = useState(false);

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
                        <IconButton
                            className="lg:hidden rounded-full ml-3 px-2 w-11 h-11 grid place-content-center relative hover:bg-gray-100 focus:text-purple-700"
                            onClick={() => setShowFilters((prev) => !prev)}
                        >
                            <TogglesIcon />
                        </IconButton>
                    </section>
                    <section className="p-4">
                        <SectionTitle title="Game format" />
                        <div className="grid p-4">
                            <div className="">
                                <DeckPlayFormatToggle
                                    formats={[
                                        CHAMPIONSHIP_FORMAT,
                                        RELIC_FORMAT,
                                    ]}
                                    selectedFormat={selectedFormat}
                                    onFormatChange={setSelectedFormat}
                                />
                            </div>

                            <DeckPlayFormatInfo
                                className="text-gray-900 text-sm mt-2 max-w-sm"
                                format={selectedFormat}
                            />
                        </div>
                    </section>

                    <GrouppedExpansions
                        validSetIds={validSetIds}
                        selectedExpansions={selectedExpansions}
                        onSelectionChanged={setSelectedExpansions}
                    />
                    <GrouppedFactionsToggle
                        selectedFactions={selectedFactions}
                        onSelectionChanged={setSelectedFactions}
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
                                                            id={card.id}
                                                            name={card.name}
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

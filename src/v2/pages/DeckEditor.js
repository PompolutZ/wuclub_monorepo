import React, { useEffect, useState } from "react";
import { factions, CHAMPIONSHIP_FORMAT } from "../../data";
import { ReactComponent as Logo } from "../../svgs/underworlds_logo.svg";
import { ReactComponent as Hex } from "../../svgs/hexagon-shape.svg";
import { ReactComponent as GridIcon } from "../../svgs/grid.svg";
import { ReactComponent as ListIcon } from "../../svgs/list.svg";
import { ReactComponent as StarIcon } from "../../svgs/star.svg";
import { useInView } from "react-intersection-observer";
import { ReactComponent as SlidersIcon } from "../../svgs/sliders.svg";
import SectionTitle from "../components/SectionTitle";
import FullScreenOverlay from "../components/FullScreenOverlay";
import useDexie from "../../hooks/useDexie";
import DebouncedInput from "../components/DebouncedInput";

function SelectedFaction({ faction = "morgwaeths-blade-coven", ...rest }) {
    return (
        <div className={`flex flex-grow ${rest.className}`}>
            <div className="">
                <picture>
                    <img
                        className="w-20 h-20"
                        src={`/assets/icons/${faction}-deck.png`}
                    />
                </picture>
            </div>
            <div className="flex-grow grid place-content-center text-gray-900 text-2xl">
                {factions[faction]}
            </div>
        </div>
    );
}

function FactionsPicker({ selected, onPicked, ...rest }) {
    return (
        <div className={`flex flex-wrap align-middle ${rest.className}`}>
            {Object.keys(factions)
                .slice(1)
                .filter((f) => f != selected)
                .map((faction) => (
                    <img
                        key={faction}
                        className="w-10 h-10 m-1"
                        onClick={() => onPicked(faction)}
                        src={`/assets/icons/${faction}-icon.png`}
                    />
                ))}
        </div>
    );
}

function Toggle({ checked }) {
    return (
        <div className="flex w-6 h-6 relative cursor-pointer">
            <Hex className="text-gray-900 stroke-current stroke-2 w-6 h-6" />
            {checked && (
                <div className="absolute grid place-content-center inset-0">
                    <Logo className="w-4 h-4" />
                </div>
            )}
        </div>
    );
}

function SetsPicker({ ...rest }) {
    return (
        <>
            <div className="flex">
                <Toggle checked />
                <p className="ml-2">
                    Select all sets available for selected format.
                </p>
            </div>
            <div className={`flex flex-wrap align-middle ${rest.className}`}>
                {rest.selectedSets.map((set) => (
                    <img
                        key={set.id}
                        className="w-10 h-10 m-1"
                        src={`/assets/icons/${set.name}-icon.png`}
                    />
                ))}
            </div>
        </>
    );
}

function Filters({
    selectedFaction,
    factionPicker,
    selectedFormat,
    selectedSets,
    ...rest
}) {
    return (
        <section className={`${rest.className}`}>
            <SectionTitle title="Warband" />
            {selectedFaction}
            {factionPicker}

            <SectionTitle title="Format" className="mt-8" />
            {selectedFormat}
            <SectionTitle title="Sets" className="mt-8" />
            <div className="flex">
                <Toggle checked />
                <p className="ml-2">
                    For dublicate cards show only newest one.
                </p>
            </div>
            <SetsPicker selectedSets={selectedSets} />
        </section>
    );
}

function Card({ image, id, name, setName, ...rest }) {
    console.log(rest);
    return (
        <>
            {image ? (
                <div className="w-1/4 p-2 mb-2">
                    <img
                        className="rounded-md hover:filter-shadow-sm"
                        src={`/assets/cards/0${id}.png`}
                    />
                    <img
                        className="w-4 h-4 mr-2 mt-2"
                        src={`/assets/icons/${setName}-icon.png`}
                    />
                </div>
            ) : (
                <div className={`w-full flex p-2 ${rest.even ? 'bg-gray-200' : 'bg-white'}`}>
                    <img
                        className="w-10 h-10 mr-2"
                        src={`/assets/icons/${setName}-icon.png`}
                    />
                    <div>{name}</div>
                    <div className="flex">
                        {
                            new Array(rest.rank?.rank || 0).fill(0).map((x, i) => (
                                <StarIcon className="w-4 h-4" key={i} />
                            ))
                        }
                    </div>
                </div>
            )}
        </>
    );
}

function FilterableCardsList({ cards, layout = 'grid', ...rest }) {
    const { ref, inView } = useInView({ threshold: 0.5 });
    const [visibleCards, setVisibleCards] = useState([]);

    useEffect(() => {
        console.log(cards);
        setVisibleCards(() => cards?.slice(0, 20));
    }, [cards]);

    useEffect(() => {
        if (!cards) return;

        if (inView) {
            setVisibleCards((current) => {
                return [
                    ...current,
                    ...cards.slice(current.length, current.length + 20),
                ];
            });
        }
    }, [inView, cards]);

    return (
        <div className={`lg:max-h-screen lg:overflow-y-auto ${rest.className}`}>
            {visibleCards?.map((card, i) => (
                <Card key={card.id} image={layout == 'grid'} {...card} even={i % 2 == 0} />
            ))}
            <div ref={ref}>Loading...</div>
        </div>
    );
}

function DeckEditor() {
    const [selectedFaction, setSelectedFaction] = useState(
        "thorns-of-the-briar-queen"
    );
    const [selectedFormat] = useState(CHAMPIONSHIP_FORMAT);
    const [selectedSets, setSelectedSets] = useState([]);
    const { cards, sets, factions, cardsRanks } = useDexie("wudb");
    const [filteredCards, setFilteredCards] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [layout, setLayout] = useState('list'); 

    useEffect(() => {
        sets.where("id")
            .above(8)
            .toArray()
            .then((sets) => setSelectedSets(sets));
    }, []);

    useEffect(() => {
        factions
            .where("name")
            .equals(selectedFaction)
            .first()
            .then(faction => {
                return cards
                    .where("[factionId+setId]")
                    .anyOf(selectedSets.flatMap(s => [faction.id, 1].map(fid => [fid, s.id])))
                    .and((card) => {
                        return card.name
                            .toUpperCase()
                            .includes(filterText.trim().toUpperCase());
                    })
                    .with({ set: "setId", faction: "factionId" })
            })
            .then(cards => {
                return Promise.all(cards.map(async card => {
                    let rank = await cardsRanks.where("[factionId+cardId]").equals([card.factionId, card.id]).first();
                    return {
                        ...card,
                        set: card.set,
                        faction: card.faction,
                        rank
                    }
                }))
            })
            .then(cards => {
                console.log(cards);

                setFilteredCards(
                    cards
                        .sort((card, next) => next.factionId - card.factionId || card.type.localeCompare(next.type))
                        .map((i) => ({ ...i, setName: i.set?.name }))
                )

            })
            .catch((e) => console.error(e));
    }, [selectedFaction, selectedFormat, selectedSets.length, filterText]);

    return (
        <div className="w-full bg-white lg:grid lg:grid-cols-8 lg:gap-2">
            <div className={`${layout == 'list' ? 'lg:col-span-3 xl:col-span-2' : 'lg:col-span-5 xl:col-span-6'}`}>
                <section className="flex p-2 items-center">
                    <DebouncedInput
                        placeholder="search for a card name..."
                        className="rounded bg-gray-200 box-border flex-1 mr-2 py-1 px-2 outline-none border-2 focus:border-accent3-500"
                        onChange={setFilterText}
                    />
                    <FullScreenOverlay
                        hasCloseButton
                        direction="to-right"
                        icon={() => <SlidersIcon className="mr-2" />}
                    >
                        <Filters
                            className="p-4 lg:opacity-100 lg:static sm:col-span-2"
                            selectedFaction={
                                <SelectedFaction
                                    className="my-4"
                                    faction={selectedFaction}
                                />
                            }
                            factionPicker={
                                <FactionsPicker
                                    className="my-4"
                                    selected={selectedFaction}
                                    onPicked={setSelectedFaction}
                                />
                            }
                            selectedFormat={selectedFormat}
                            selectedSets={selectedSets}
                        />
                    </FullScreenOverlay>
                    
                    <div>
                    {
                        layout == 'list' ? <GridIcon onClick={() => setLayout('grid')} /> : <ListIcon onClick={() => setLayout('list')} />
                    }
                    </div>
                </section>
                <FilterableCardsList
                    className="flex flex-wrap content-start"
                    cards={filteredCards}
                    layout={layout}
                />
            </div>

            <section className={`${layout == 'list' ? 'lg:col-span-5 xl:col-span-6' : 'lg:col-span-3 xl:col-span-2'} bg-orange-500 opacity-0 lg:opacity-100 sm:static`}>
                Current Deck
            </section>
        </div>
    );
}

export default DeckEditor;

import React, { useContext, useEffect, useMemo, useState } from "react";
import { FirebaseContext } from "../firebase";
import Button from "@material-ui/core/Button";
import Progress from "@material-ui/core/CircularProgress";
import { cardsDb, firstUniversalCardPerWave } from "../data";

function useRealtimeDatabaseRefOnce(path) {
    const firebase = useContext(FirebaseContext);
    const [value, setValue] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        firebase.realdb
            .ref(path)
            .once("value")
            .then((snapshot) => {
                setValue(snapshot.val());
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, [firebase, path]);

    return [loading, value, error];
}

function CardsRating(props) {
    const firebase = React.useContext(FirebaseContext);
    const [data, setData] = React.useState(null);
    const [printData, setPrintData] = React.useState({});
    const [updated, setUpdated] = React.useState(false);
    const [pubLog, setPubLog] = useState(undefined);
    const [loadingDecks, decks, decksError] = useRealtimeDatabaseRefOnce(
        "/decks/"
    );

    React.useEffect(() => {
        if (!props.match.params.faction) return;

        firebase.realdb
            .ref(`/cards_ranks/${props.match.params.faction}`)
            .once("value")
            .then((s) => setPrintData(s.val()));
    }, [props.match.params]);

    React.useEffect(() => {
        firebase
            .decks()
            .once("value")
            .then((snap) => {
                const data = Object.entries(snap.val());
                const fixedDate = data.map(([id, value]) => {
                    let lastModified = new Date(0);
                    if (value.created && value.created.seconds) {
                        lastModified.setSeconds(value.created.seconds);
                    } else {
                        lastModified = new Date(value.created);
                    }

                    return [id, { ...value, lastModified: lastModified }];
                });

                //const filteredByDate = fixedDate.filter(([id, value]) => value.lastModified > new Date(2019, 6, 23));
                const groupedByFactions = fixedDate.reduce(
                    (acc, [id, value]) => {
                        if (id === "undefined" || !value.cards) return acc;

                        const factionPrefix = id.split("-")[0];
                        const decks = acc[factionPrefix]
                            ? [...acc[factionPrefix], value]
                            : [value];
                        return { ...acc, [factionPrefix]: decks };
                    },
                    {}
                );

                const factionsWithMaxSetsCount = Object.entries(
                    groupedByFactions
                ).reduce((acc, [prefix, value]) => {
                    return {
                        ...acc,
                        [prefix]: {
                            data: value,
                            maxSets: Math.max(
                                ...value.map((x) => x.sets.length)
                            ),
                        },
                    };
                }, {});

                const baseDate = new Date(2017, 9, 21);

                const cardRankingsPerFaction = Object.entries(
                    factionsWithMaxSetsCount
                ).reduce((factionsAcc, [faction, { data, maxSets }]) => {
                    const factionSummary = data.reduce((decksAcc, deck) => {
                        const ratings = deck.cards.reduce((acc, card) => {
                            return {
                                ...acc,
                                [card]:
                                    ((deck.lastModified - baseDate) /
                                        (new Date() - baseDate)) *
                                    (deck.sets.length / maxSets),
                            };
                        }, {});

                        for (let [id, rating] of Object.entries(ratings)) {
                            if (decksAcc[id]) {
                                decksAcc[id] = decksAcc[id] + rating;
                            } else {
                                decksAcc[id] = rating;
                            }
                        }

                        return decksAcc;
                    }, {});

                    const maxRating = Math.max(
                        ...Object.values(factionSummary)
                    );

                    const normalizedRatings = Object.entries(
                        factionSummary
                    ).reduce((acc, [card, rating]) => {
                        return {
                            ...acc,
                            [card]: Math.round(
                                Math.round((rating / maxRating) * 100) / 10
                            ),
                        };
                    }, {});

                    return {
                        ...factionsAcc,
                        [faction]: {
                            ...normalizedRatings,
                            maxRating: maxRating,
                        },
                    };
                }, {});

                const allMaxSetsCount = fixedDate.reduce((acc, [id, value]) => {
                    if (id === "undefined" || !value.cards) return acc;

                    return Math.max(acc, value.sets.length);
                }, 0);

                const genericRatings = fixedDate.reduce((acc, [id, deck]) => {
                    if (id === "undefined" || !deck.cards) return acc;

                    const ratings = deck.cards
                        .filter((card) => {
                            return (
                                Number(card) >=
                                firstUniversalCardPerWave[
                                    Math.round(Number(card) / 1000)
                                ]
                            ); // here we find wave first then filter out non-universal cards
                        })
                        .reduce((acc, card) => {
                            return {
                                ...acc,
                                [card]:
                                    ((deck.lastModified - baseDate) /
                                        (new Date() - baseDate)) *
                                    (deck.sets.length / allMaxSetsCount),
                            };
                        }, {});

                    for (let [id, rating] of Object.entries(ratings)) {
                        if (acc[id]) {
                            acc[id] = acc[id] + rating;
                        } else {
                            acc[id] = rating;
                        }
                    }

                    return acc;
                }, {});

                const maxGenericRank = Math.max(
                    ...Object.values(genericRatings)
                );

                const normalizedGenericRanks = Object.entries(
                    genericRatings
                ).reduce((acc, [card, rating]) => {
                    return {
                        ...acc,
                        [card]: Math.round(
                            Math.round((rating / maxGenericRank) * 100) / 10
                        ),
                    };
                }, {});

                console.log("DONE", cardRankingsPerFaction, {
                    u: normalizedGenericRanks,
                });
                // console.log(cardRankingsPerFaction);
                setData({
                    ...cardRankingsPerFaction,
                    u: normalizedGenericRanks,
                    universal: normalizedGenericRanks,
                });
            });
    }, []);

    React.useEffect(() => {
        if(!decks) return;

        const flattenedDecks = Object.entries(decks)
            .filter(([id, deck]) => !deck.private)
            .map(([id, deck]) => ({ ...deck, id}))
            .map(deck => {
                let updatedDeck = { ...deck };
                if(!deck.updatedutc) {
                    if(typeof deck.created === 'string') {
                        updatedDeck.updatedutc = new Date(deck.created).getTime();
                    } else {
                        let date = new Date(0);
                        date.setSeconds(deck.created.seconds);
                        updatedDeck.updatedutc = date.getTime();
                    }
                }

                return updatedDeck;
            })
        
        const descending = flattenedDecks.sort((x, y) => y.updatedutc - x.updatedutc);
        const initPubLog = descending.reduce((log, deck) => {
            return { ...log, [deck.updatedutc]: { id: deck.id, action: "SHARED" }}
        }, {})
        console.log(initPubLog);
        setPubLog(initPubLog);
        
    }, [decks, firebase]);

    const handleUpdateClick = () => {
        firebase.realdb
            .ref("/cards_ranks")
            .set(data)
            .then(() => setUpdated(true))
            .catch((e) => console.error(e));
    };

    const handleUpdatePubLog = () => {
        firebase.realdb
            .ref("/public_decks_log")
            .set(pubLog)
            .then(() => console.log('Updated Pub Log'))
            .catch((e) => console.error(e));
    }

    return (
        <div>
            Card Rating
            {!data && <Progress />}
            <Button
                onClick={handleUpdateClick}
                disabled={!data}
                style={{ color: updated ? "green" : "black" }}
            >
                Update Ranking
            </Button>
            <div>
                {loadingDecks && <div>Loading Decks....</div>}
                {decksError && <pre>{JSON.stringify(decksError)}</pre>}
            </div>
            <Button
                onClick={handleUpdatePubLog}
            >
                Update PubLog
            </Button>
        </div>
    );
}

export default CardsRating;

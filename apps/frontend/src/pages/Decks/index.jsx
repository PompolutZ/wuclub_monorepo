import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useListAllPublicDecks } from "../../hooks/wunderworldsAPIHooks";
import { FixedVirtualizedList } from "../../v2/components/FixedVirtualizedList";
import PublicDeckLink from "./PublicDeckLink";

const BATCH = 30;
let SKIP = 0;

let prev = [];

function getAllDecks(newItems) {
    prev = prev.concat(newItems);
    return prev.map((deck) => ({ ...deck, cards: deck.deck }))
}

export default function Deck() {
    const { faction } = useParams();
    const [{ data }, refetch] = useListAllPublicDecks(true);

    useEffect(() => {
        // this is basically on initial load
        if (faction === "all") {
            refetch({
                data: {
                    skip: SKIP,
                    limit: BATCH
                }
            });
        } else {
            refetch({
                data: {
                    faction,
                },
            });
        }
    }, [faction, refetch]);

    return (
        <div className="flex-1 flex lg:max-w-xl lg:mx-auto group mb-8">
            {data && (
                <FixedVirtualizedList
                    estimateItemSize={101}
                    items={getAllDecks(data)}
                    lazy={true}
                    onLoadMore={() => {
                        SKIP += BATCH;
                        refetch({
                            data: {
                                skip: SKIP,
                                limit: BATCH
                            }
                        })
                    }}
                >
                    {(deck, { key }) => <PublicDeckLink key={key} {...deck} />}
                </FixedVirtualizedList>
            )}
        </div>
    );
}

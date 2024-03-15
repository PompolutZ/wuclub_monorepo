import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useListAllPublicDecks } from "../../hooks/wunderworldsAPIHooks";
import { FixedVirtualizedList } from "../../v2/components/FixedVirtualizedList";
import PublicDeckLink from "./PublicDeckLink";

const BATCH = 30;
let SKIP = 0;

let prev = [];

function getAllDecks(newItems) {
    // because React renders the same component twice, we need to check if the last item is the same
    if (newItems.at(-1)?.deckId !== prev.at(-1)?.deckId) {
        prev = prev.concat(newItems);
    }

    return prev.map((deck) => ({ ...deck, cards: deck.deck }))
}

const getRefetchPayload = (faction, limit, skip) => {
    const payload = {
        data: {
            skip,
            limit
        }
    };

    if (faction !== "all") {
        payload.data.faction = faction;
    }

    return payload;
}

export default function Deck() {
    const { faction } = useParams();
    const [{ data }, refetch] = useListAllPublicDecks(true);
    const cancelFurtherFetch = data && (data.length === 0 || data.length < BATCH);

    useEffect(() => {
        refetch(getRefetchPayload(faction, BATCH, SKIP));

        return () => {
            SKIP = 0;
            prev = [];
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
                        if (cancelFurtherFetch) return;

                        SKIP += BATCH;
                        refetch(getRefetchPayload(faction, BATCH, SKIP));
                    }}
                >
                    {(deck, { key }) => <PublicDeckLink key={key} {...deck} />}
                </FixedVirtualizedList>
            )}
        </div>
    );
}

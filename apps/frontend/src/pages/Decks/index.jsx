import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useListAllPublicDecks } from "../../hooks/wunderworldsAPIHooks";
import { FixedVirtualizedList } from "../../v2/components/FixedVirtualizedList";
import PublicDeckLink from "./PublicDeckLink";

export default function Deck() {
    const { faction } = useParams();
    const [{ data }, refetch] = useListAllPublicDecks(true);

    useEffect(() => {
        if (faction === "all") {
            refetch();
        } else {
            refetch({
                data: {
                    faction,
                },
            });
        }
    }, [faction, refetch]);

    return (
        <div className="flex-1 flex lg:max-w-xl lg:mx-auto group">
            {data && (
                <FixedVirtualizedList
                    estimateItemSize={120}
                    items={data.map((deck) => ({ ...deck, cards: deck.deck }))}
                >
                    {(deck, { key }) => (
                        <div className="grid" key={key}>
                            <PublicDeckLink {...deck} />
                        </div>
                    )}
                </FixedVirtualizedList>
            )}
        </div>
    );
}

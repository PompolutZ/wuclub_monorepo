import { getRouteApi } from "@tanstack/react-router";
import { FactionName } from "@fxdxpz/wudb";
import { FixedVirtualizedList } from "../../shared/components/FixedVirtualizedList";
import PublicDeckLink from "./PublicDeckLink";
import { useQueryDecks } from "./useDecksQuery";

const route = getRouteApi("/decks/$faction");

export default function Deck() {
  const { faction } = route.useParams() as {
    faction: FactionName | "all";
  };
  const { data, isFetching, hasNextPage, fetchNextPage } = useQueryDecks(
    faction === "all" ? undefined : faction,
  );

  return (
    <div className="flex-1 flex lg:max-w-xl lg:mx-auto group mb-8">
      <FixedVirtualizedList
        estimateItemSize={101}
        items={data.pages.flatMap((x) => x.decks ?? [])}
        lazy={true}
        onLoadMore={() => !isFetching && hasNextPage && fetchNextPage()}
      >
        {(deck, { key }) => (
          <PublicDeckLink
            key={key}
            deck={Array.isArray(deck) ? deck[0] : deck}
          />
        )}
      </FixedVirtualizedList>
    </div>
  );
}

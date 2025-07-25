import { useParams } from "react-router-dom";
import { FixedVirtualizedList } from "../../shared/components/FixedVirtualizedList";
import PublicDeckLink from "./PublicDeckLink";
import { useQueryDecks } from "./useDecksQuery";

export default function Deck() {
  const { faction } = useParams();
  const { data, isFetching, hasNextPage, fetchNextPage } = useQueryDecks(
    faction === "all" ? undefined : faction,
  );

  return (
    <div className="flex-1 flex lg:max-w-xl lg:mx-auto group mb-8">
      {data && (
        <FixedVirtualizedList
          estimateItemSize={101}
          items={data?.pages?.flatMap((x) => x.decks ?? [])}
          lazy={true}
          onLoadMore={() => !isFetching && hasNextPage && fetchNextPage()}
        >
          {(deck, { key }) => {
            return <PublicDeckLink key={key} {...deck} />
          }}
        </FixedVirtualizedList>
      )}
    </div>
  );
}

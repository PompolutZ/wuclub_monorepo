import { DeleteConfirmationDialog } from "@components/DeleteConfirmationDialog";
import { ScrollContainer } from "@components/ScrollContainer";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useAuthUser from "../../hooks/useAuthUser";
import { useDeleteDeck } from "../../shared/hooks/useDeleteDeck";
import { AnonymousUserDecksStorageInfo } from "./AnonymousUserDeckStorageInfo";
import { DeckLink } from "./DeckLink";
import { useAnonDecksSynchronisation } from "./useAnonDeckSyncronisation";
import { useUserDecksQuery } from "./useUserDecksQuery";
import { LazyLoading } from "../../components/LazyLoading";
import { logger } from "@/utils/logger";
import { Toast } from "../Deck/ReadonlyDeck/atoms/Toast";
import { FilterSortBar } from "./components/FilterSortBar";
import { SortOption } from "./components/SortDropdown";
import { sets } from "@fxdxpz/wudb";
import { Deck } from "@fxdxpz/schema";

function MyDecksPage() {
  const user = useAuthUser();
  const { data: userDecks, isFetching: loading } = useUserDecksQuery();
  const { mutateAsync } = useDeleteDeck();

  useAnonDecksSynchronisation();

  const [confirmDeleteDeckId, setConfirmDeleteDeckId] = useState<string | null>(
    null,
  );
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [selectedSetFilters, setSelectedSetFilters] = useState<string[]>([]);

  const handleCloseDeleteDialog = () => {
    setConfirmDeleteDeckId(null);
  };

  const handleDeleteDeckId = (deckId: string) => {
    setConfirmDeleteDeckId(deckId);
  };

  const handleDeleteDeck = async () => {
    try {
      if (!confirmDeleteDeckId) return;
      await mutateAsync(confirmDeleteDeckId);
      setConfirmDeleteDeckId(null);
    } catch (e) {
      logger.error("Failed to delete deck", e as Error, {
        deckId: confirmDeleteDeckId,
      });
      setToastContent("Failed to delete deck. Please try again.");
      setShowToast(true);
    }
  };

  const resetToast = () => {
    setShowToast(false);
    setToastContent(null);
  };

  const filterDecks = (decks: Deck[], filters: string[]) => {
    if (filters.length === 0) return decks;
    return decks.filter((deck) =>
      deck.sets.some((set) => filters.includes(set)),
    );
  };

  const sortDecks = (decks: Deck[], sortOption: SortOption) => {
    const sorted = [...decks];
    switch (sortOption) {
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "date-desc":
        return sorted.sort((a, b) => b.updatedutc - a.updatedutc);
      case "date-asc":
        return sorted.sort((a, b) => a.updatedutc - b.updatedutc);
      default:
        return sorted;
    }
  };

  const filteredAndSortedDecks = useMemo(() => {
    if (!userDecks?.decks) return [];
    // Cast to Deck[] since both AnonDecks and Deck have the required fields
    const decks = userDecks.decks as Deck[];
    const filtered = filterDecks(decks, selectedSetFilters);
    return sortDecks(filtered, sortBy);
  }, [userDecks, selectedSetFilters, sortBy]);

  return (
    <div className="flex-1 flex p-4 flex-col">
      <ScrollContainer>
        <div className="flex flex-col h-full">
          {!user && <AnonymousUserDecksStorageInfo />}
          {loading && <LazyLoading />}

          {!loading && userDecks?.total === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <p>
                You don't have any decks yet.{" "}
                <Link className="text-purple-700 font-bold" to="/deck/create">
                  Let's make one!
                </Link>
              </p>
            </div>
          )}

          {userDecks && userDecks.total > 0 && (
            <div className="flex-1 flex flex-col min-h-0">
              <FilterSortBar
                sortBy={sortBy}
                onSortChange={setSortBy}
                selectedSets={selectedSetFilters}
                onSetsChange={setSelectedSetFilters}
                onClearFilters={() => setSelectedSetFilters([])}
                availableSets={Object.keys(sets)}
              />
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {filteredAndSortedDecks.length === 0 &&
                selectedSetFilters.length > 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-600">
                      No decks found with selected filters.{" "}
                      <button
                        className="text-purple-700 font-bold"
                        onClick={() => setSelectedSetFilters([])}
                      >
                        Clear filters
                      </button>
                    </p>
                  </div>
                ) : (
                  filteredAndSortedDecks.map((deck) => (
                    <DeckLink
                      key={deck.deckId}
                      onDelete={handleDeleteDeckId}
                      deck={deck}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollContainer>
      <DeleteConfirmationDialog
        title="Delete deck"
        description={`Are you sure you want to delete deck: '${
          userDecks?.decks.find((deck) => deck.deckId === confirmDeleteDeckId)
            ?.name
        }'`}
        open={!!confirmDeleteDeckId}
        onCloseDeleteDialog={handleCloseDeleteDialog}
        onDeleteConfirmed={handleDeleteDeck}
        onDeleteRejected={handleCloseDeleteDialog}
      />

      <Toast
        className="border-purple-700 border-2 bg-purple-100 font-bold p-4 text-purple-700 text-xs lg:text-default rounded-md shadow-md"
        show={showToast}
        onTimeout={resetToast}
      >
        {toastContent}
      </Toast>
    </div>
  );
}

export default MyDecksPage;

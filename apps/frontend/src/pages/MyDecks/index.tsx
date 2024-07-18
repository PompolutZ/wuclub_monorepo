import { DeleteConfirmationDialog } from "@components/DeleteConfirmationDialog";
import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthUser from "../../hooks/useAuthUser";
import { useDeleteDeck } from "../../shared/hooks/useDeleteDeck";
import { AnonymousUserDecksStorageInfo } from "./AnonymousUserDeckStorageInfo";
import { DeckLink } from "./DeckLink";
import { useAnonDecksSynchronisation } from "./useAnonDeckSyncronisation";
import { useUserDecksQuery } from "./useUserDecksQuery";

function MyDecksPage() {
  const user = useAuthUser();
  const { data: userDecks, isFetching: loading } = useUserDecksQuery();
  const { mutateAsync } = useDeleteDeck();

  useAnonDecksSynchronisation();
  
  const [confirmDeleteDeckId, setConfirmDeleteDeckId] = useState<string | null>(
    null,
  );

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
      console.error(e);
    }
  };

  return (
    <div className="flex-1 flex p-4 flex-col">
      {!user && <AnonymousUserDecksStorageInfo />}
      {loading && (
        <div className="flex items-center justify-center">
          <p>Loading...</p>
        </div>
      )}
      {!loading && userDecks?.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p>
            You don't have any decks yet.{" "}
            <Link className="text-purple-700 font-bold" to="/deck/create">
              Let's make one!
            </Link>
          </p>
        </div>
      )}

      {userDecks && userDecks.length > 0 && (
        <div className="flex-1">
          {userDecks
            .map((deck) => ({
              ...deck,
              id: deck.deckId,
            }))
            .sort((x, y) => y.updatedutc - x.updatedutc)
            .map((deck) => (
              <DeckLink
                key={deck.id}
                onDelete={handleDeleteDeckId}
                deck={deck}
              />
            ))}
        </div>
      )}

      <DeleteConfirmationDialog
        title="Delete deck"
        description={`Are you sure you want to delete deck: '${
          userDecks?.find((deck) => deck.deckId === confirmDeleteDeckId)?.name
        }'`}
        open={!!confirmDeleteDeckId}
        onCloseDeleteDialog={handleCloseDeleteDialog}
        onDeleteConfirmed={handleDeleteDeck}
        onDeleteRejected={handleCloseDeleteDialog}
      />
    </div>
  );
}

export default MyDecksPage;

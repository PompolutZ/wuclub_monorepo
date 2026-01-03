import { Deck } from "@fxdxpz/schema";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import DeleteConfirmationDialog from "../../atoms/DeleteConfirmationDialog";
import { getCardById } from "../../data/wudb";
import { useDeleteDeck } from "../../shared/hooks/useDeleteDeck";
import ReadonlyDeck from "./ReadonlyDeck";
import { Toast } from "./ReadonlyDeck/atoms/Toast";
import { logger } from "@/utils/logger";

const Deck2 = () => {
  const { state } = useLocation<{ deck: Deck; canUpdateOrDelete: boolean }>();
  const history = useHistory();
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [cardsView, setCardsView] = useState(false);
  const { mutateAsync: deleteUserDeck } = useDeleteDeck();
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState<string | null>(null);

  const deck = state.deck;
  const cards = state.deck.deck.map(getCardById);
  const factionId = state.deck && state.deck.deckId.split("-")[0];
  const canUpdateOrDelete = state.canUpdateOrDelete;

  const handleChangeView = () => {
    setCardsView((prev) => !prev);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogVisible(false);
  };

  const handleDeleteDeck = async () => {
    try {
      if (!deck) return;

      await deleteUserDeck(deck.deckId);
      handleCloseDeleteDialog();
      history.replace({
        pathname: "/mydecks",
        state: { deck, status: "DELETED" },
      });
    } catch (e) {
      logger.error("Failed to delete deck", e as Error, { deckId: deck?.deckId });
      handleShowToast("Failed to delete deck. Please try again.");
    }
  };

  const _deleteDeck = async () => {
    setIsDeleteDialogVisible(true);
  };

  const handleShowToast = (text: string) => {
    setToastContent(text);
    setShowToast(true);
  };

  const resetToast = () => {
    setShowToast(false);
    setToastContent(null);
  };

  if (!deck) return null;

  return (
    <>
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <ReadonlyDeck
            id={deck.deckId}
            name={deck.name}
            author={factionId}
            faction={deck.faction as any}
            cards={cards}
            sets={deck.sets as any[]}
            createdutc={deck.createdutc}
            updatedutc={deck.updatedutc}
            private={deck.private}
            onCardsViewChange={handleChangeView}
            cardsView={cardsView}
            canUpdateOrDelete={canUpdateOrDelete}
            onDelete={_deleteDeck}
            showToast={handleShowToast}
          />
        </div>
      </div>

      <Toast
        className="border-purple-700 border-2 bg-purple-100 font-bold p-4 text-purple-700 text-xs lg:text-default rounded-md shadow-md"
        show={showToast}
        onTimeout={resetToast}
      >
        {toastContent}
      </Toast>

      <DeleteConfirmationDialog
        title="Delete deck"
        description={`Are you sure you want to delete deck: '${deck.name}'`}
        open={isDeleteDialogVisible}
        onCloseDeleteDialog={handleCloseDeleteDialog}
        onDeleteConfirmed={handleDeleteDeck}
        onDeleteRejected={handleCloseDeleteDialog}
      />
    </>
  );
};

export default Deck2;

import { useHistory, useLocation, useParams } from "react-router-dom";
import { useGetUserDeckById } from "../../hooks/wunderworldsAPIHooks";
import { useEffect, useState } from "react";
import { useDeleteUserDeckFactory } from "../../hooks/useDeleteUserDeckFactory";
import { getCardById } from "../../data/wudb";
import { Toast } from "./ReadonlyDeck/atoms/Toast";
import ReadonlyDeck from "./ReadonlyDeck";
import DeleteConfirmationDialog from "../../atoms/DeleteConfirmationDialog";

type Deck = {
  id: string;
  name: string;
  cards: unknown[];
};

const Deck2 = () => {
  const { id } = useParams<{ id: string }>();
  const { fetch } = useGetUserDeckById(id);
  const { state } = useLocation<{ deck: Deck; canUpdateOrDelete: boolean }>();
  const [loading, setLoading] = useState(false);
  const [deck, setDeck] = useState<Deck | undefined>(undefined);
  const [cards, setCards] = useState<unknown[]>([]);
  const [factionId, setFactionId] = useState("");
  const [canUpdateOrDelete, setCanUpdateOrDelete] = useState(false);
  const history = useHistory();
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [cardsView, setCardsView] = useState(false);
  const deleteUserDeck = useDeleteUserDeckFactory();
  const [cannotShowDeckMessage, setCannotShowDeckMessage] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    if (state) {
      setDeck(state.deck);
      setCards(state.deck.cards.map(getCardById));
      setFactionId(state.deck && state.deck.id.split("-")[0]);
      setCanUpdateOrDelete(state.canUpdateOrDelete);

      setLoading(false);
    } else {
      fetch()
        .then((r) => {
          const [data] = r.data;
          if (!data) {
            setCannotShowDeckMessage(true);
          }

          setDeck(data);
          setCards(data.deck.map(getCardById));
          setFactionId(id.split("-")[0]);

          // NOTE! This should be fine, since we are using user-decks endpoint which
          // performs token check whether current user is the one who is the decks author
          setCanUpdateOrDelete(true);
        })
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [state]);

  const handleChangeView = () => {
    setCardsView((prev) => !prev);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogVisible(false);
  };

  const handleDeleteDeck = async () => {
    try {
      await deleteUserDeck(deck?.id);
      handleCloseDeleteDialog();
      history.replace({
        pathname: "/mydecks",
        state: { deck, status: "DELETED" },
      });
    } catch (e) {
      console.error(e);
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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (cannotShowDeckMessage) {
    return (
      <div className="flex-1 flex items-center justify-center px-8 text-xl">
        <p>
          Not possible to see this deck because it was either deleted or not
          shared with everyone.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col">
        <div className="flex">
          <div className="flex-1 bg-violet-500"></div>
          <div className="bg-violet-400"></div>
        </div>
        <div className="bg-orange-500 order-last lg:order-none"></div>
        <div className="flex-1">
          {deck && (
            <>
              <ReadonlyDeck
                {...deck}
                onCardsViewChange={handleChangeView}
                cardsView={cardsView}
                desc=""
                factionId={factionId}
                cards={cards}
                canUpdateOrDelete={canUpdateOrDelete}
                onDelete={_deleteDeck}
                showToast={handleShowToast}
              />

              <DeleteConfirmationDialog
                title="Delete deck"
                description={`Are you sure you want to delete deck: '${deck.name}'`}
                open={isDeleteDialogVisible}
                onCloseDeleteDialog={handleCloseDeleteDialog}
                onDeleteConfirmed={handleDeleteDeck}
                onDeleteRejected={handleCloseDeleteDialog}
              />
            </>
          )}
        </div>
      </div>

      <Toast
        className="border-purple-700 border-2 bg-purple-100 font-bold p-4 text-purple-700 text-xs lg:text-default rounded-md shadow-md"
        show={showToast}
        onTimeout={resetToast}
      >
        {toastContent}
      </Toast>
    </>
  );
};

export default Deck2;

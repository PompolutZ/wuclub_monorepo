import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { VIEW_DECK } from "../../constants/routes";
import { checkCardIsObjective, getCardById } from "../../data/wudb";
import TrashIcon from "@icons/trash.svg?react";
import ScoringOverview from "../../atoms/ScoringOverview";
import SetsList from "../../atoms/SetsList";
import { DeleteConfirmationDialog } from "@components/DeleteConfirmationDialog";
import { fetchUserDecks } from "../../hooks/wunderworldsAPIHooks";
import useAuthUser from "../../hooks/useAuthUser";
import { useDeleteUserDeckFactory } from "../../hooks/useDeleteUserDeckFactory";
import { useSaveDeckFactory } from "../../hooks/useSaveDeckFactory";
import Firebase from "../../firebase";
import { PeopleIcon } from "../../v2/components/Icons";
import { FactionDeckPicture } from "@components/FactionDeckPicture";
import { DeckTitle } from "@components/DeckTitle";
import { offlineDB } from "../../services/db";
import axios from "axios";
import { useUserDecksQuery } from "./useUserDecksQuery";
import { DeckLink } from "./DeckLink";

function useAnonDecksSyncronisation(refetch) {
  const user = useAuthUser();
  const saveDeck = useSaveDeckFactory();

  useEffect(() => {
    if (!user) return;
    offlineDB.anonDecks
      .toArray()
      .then((anonDecks) => {
        return Promise.all(
          anonDecks.map(async (d) => {
            const {
              deckId,
              createdutc,
              updatedutc,
              deck,
              sets,
              name,
              faction,
            } = d;
            await axios.post("/api/v1/user-decks", {
              deckId,
              createdutc,
              updatedutc,
              deck,
              sets,
              name,
              faction,
              private: d.private,
            });

            return d.id;
          }),
        );
      })

      .then((idsToDelete) => {
        offlineDB.anonDecks.bulkDelete(idsToDelete);
      })
      .then(() => {
        refetch();
      })
      .catch((e) => {
        console.error("Error", e);
      });
  }, [user, refetch, saveDeck]);
}

function AnonymousUserDecksStorageInfo() {
  return (
    <div>
      <p className="border-2 border-purple-700 text-purple-700 bg-purple-100 text-justify p-4 my-4 rounded-md lg:mx-auto lg:w-2/5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="inline relative mb-1 h-5 w-5 mr-2"
          fill="#DDD6FE"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Greetings stranger! Decks below are stored in this very browser only. If
        you{" "}
        {
          <Link className="underline font-bold" to="/login">
            sign in
          </Link>
        }
        , they will be stored in database and available to you on any device.
      </p>
    </div>
  );
}

function MyDecksPage() {
  const user = useAuthUser();
  const { data: userDecks, isFetching: loading, refetch } = useUserDecksQuery();
  console.log(userDecks);
  //useAnonDecksSyncronisation(refetch);
  const [confirmDeleteDeckId, setConfirmDeleteDeckId] = useState(undefined);
  const deleteDeckAsync = useDeleteUserDeckFactory();

  const handleCloseDeleteDialog = () => {
    setConfirmDeleteDeckId(null);
  };

  const handleDeleteDeckId = (deckId) => () => {
    setConfirmDeleteDeckId(deckId);
  };

  const handleDeleteDeck = async () => {
    try {
      await deleteDeckAsync(confirmDeleteDeckId);
      refetch();
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
      {!loading && userDecks && userDecks.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p>
            You don't have any decks yet.{" "}
            <Link className="text-purple-700 font-bold" to="/deck/create">
              Let's make one!
            </Link>
          </p>
        </div>
      )}

      {userDecks?.length > 0 && (
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
        onCloseDialog={handleCloseDeleteDialog}
        onDeleteConfirmed={handleDeleteDeck}
        onDeleteRejected={handleCloseDeleteDialog}
      />
    </div>
  );
}

export default MyDecksPage;

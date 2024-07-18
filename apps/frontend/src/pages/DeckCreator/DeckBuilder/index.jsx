import { DeleteConfirmationDialog } from "@components/DeleteConfirmationDialog";
import { Transition } from "@headlessui/react";
import AddCardIcon from "@icons/add-card.svg?react";
import DeckIcon from "@icons/deck.svg?react";
import WarbandIcon from "@icons/warband.svg?react";
import { Children, useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import useMeasure from "react-use-measure";
import { generateDeckId } from "shared/helpers";
import { useDeckBuilderDispatcher, useDeckBuilderState } from "..";
import FightersInfoList from "../../../atoms/FightersInfoList";
import useAuthUser from "../../../hooks/useAuthUser";
import { useBreakpoint } from "../../../hooks/useMediaQuery";
import { resetDeckAction, saveDeckAction, updateDeckAction } from "../reducer";
import BottomPanelNavigation from "./components/BottomPanelNavigation";
import CardLibraryToggles from "./components/CardLibraryFilters";
import CardsLibrary from "./components/CardsLibrary";
import Deck from "./components/Deck";
import LibraryFilters from "./components/LibraryFilters";

function CardsLibraryWithFilters() {
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState({});
  const [ref, bounds] = useMeasure();

  return (
    <div className="flex-1 flex-col flex p-2 lg:border-r">
      <CardLibraryToggles onSearchTextChange={setSearchText} />
      <LibraryFilters bounds={bounds} onFiltersChanged={setFilter} />

      <div ref={ref} className="flex flex-1">
        <CardsLibrary searchText={searchText} filter={filter} />
      </div>
    </div>
  );
}

const tabs = [
  {
    name: "Library",
    Icon: ({ className }) => <AddCardIcon className={className} />,
  },
  {
    name: "Deck",
    Icon: ({ className }) => <DeckIcon className={className} />,
  },
  {
    name: "Warband",
    Icon: ({ className }) => <WarbandIcon className={className} />,
  },
];

const MobileLayout = ({ children }) => {
  const { action } = useParams();
  const childrenArray = Children.toArray(children);
  const [activeTabIndex, setActiveTabIndex] = useState(
    action && action !== "create" ? 1 : 0,
  );

  return (
    <div className="flex flex-col">
      <div className="flex-1 flex">{childrenArray[activeTabIndex]}</div>
      <BottomPanelNavigation
        tabs={tabs}
        activeTabIndex={activeTabIndex}
        setActiveTabIndex={setActiveTabIndex}
      />
    </div>
  );
};

function DeckBuilder({ currentDeckName, existingDeckId, isPrivate }) {
  const isMobile = useBreakpoint("mobile");
  const [deckId, setDeckId] = useState(existingDeckId || "");
  const [deckName, setDeckName] = useState(currentDeckName || "");
  const [showWarband, setShowWarband] = useState(false);
  const [showConfirmDeckReset, setShowConfirmDeckReset] = useState(false);
  const { uid, displayName } = useAuthUser() || {
    uid: "Anonymous",
    displayName: "Anonymous",
  };

  const { faction, status } = useDeckBuilderState();

  const dispatch = useDeckBuilderDispatcher();

  useEffect(() => {
    if (existingDeckId) return;

    setDeckId(generateDeckId(faction.abbr));
  }, [faction, existingDeckId]);

  const handleCloseConfirmDialog = () => {
    setShowConfirmDeckReset(false);
  };

  const handleResetDeck = () => {
    dispatch(resetDeckAction());
    handleCloseConfirmDialog();
  };

  const handleResetCurrentDeck = () => {
    setShowConfirmDeckReset(true);
  };

  const handleSaveDeck = () => {
    if (existingDeckId) {
      dispatch(
        updateDeckAction({
          deckName: deckName || `${faction.displayName} Deck`,
          author: uid,
          authorDisplayName: displayName,
          deckId,
          private: isPrivate,
        }),
      );
    } else {
      dispatch(
        saveDeckAction({
          deckName: deckName || `${faction.displayName} Deck`,
          author: uid,
          authorDisplayName: displayName,
          deckId,
        }),
      );
    }
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:pb-0 lg:grid-cols-4 bg-white relative">
      {status === "Saved" && <Redirect to="/mydecks" />}

      {isMobile && (
        <MobileLayout>
          <CardsLibraryWithFilters />
          <div className="flex-1 relative">
            <div className="absolute inset-0 overflow-y-auto">
              <Deck
                deckName={deckName}
                onDeckNameChange={setDeckName}
                onSave={handleSaveDeck}
                onReset={handleResetCurrentDeck}
              />
            </div>
          </div>
          <FightersInfoList />
        </MobileLayout>
      )}

      {!isMobile && (
        <>
          <CardsLibraryWithFilters />
          <div className="lg:col-span-3 p-2 pt-4">
            <button
              className={`hidden lg:flex ml-auto mr-4 items-center py-2 text-xs text-gray-700 outline-none hover:text-purple-700 focus:text-purple-500`}
              onClick={() => {
                setShowWarband(true);
              }}
            >
              <WarbandIcon className="h-6 fill-current mr-2" />
              Warband
            </button>

            <Deck
              deckName={deckName}
              onDeckNameChange={setDeckName}
              onSave={handleSaveDeck}
              onReset={handleResetCurrentDeck}
            />
          </div>

          <Transition
            show={showWarband}
            className="fixed inset-0 z-10 flex backdrop-filter backdrop-blur-sm"
            enter="transition transform duration-300"
            enterTo="opacity-100 translate-y-0"
            enterFrom="opacity-0 translate-y-10"
          >
            <FightersInfoList onClose={() => setShowWarband(false)} />
          </Transition>
        </>
      )}

      <DeleteConfirmationDialog
        title="Clear current deck"
        description={`Are you sure you want to clear current deck? Your deck building progress will be lost.`}
        open={showConfirmDeckReset}
        onCloseDialog={handleCloseConfirmDialog}
        onDeleteConfirmed={handleResetDeck}
        onDeleteRejected={handleCloseConfirmDialog}
      />
    </div>
  );
}

export default DeckBuilder;

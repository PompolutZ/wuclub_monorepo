import { createLazyFileRoute } from '@tanstack/react-router'
import { DeleteConfirmationDialog } from "@components/DeleteConfirmationDialog";
import { Transition } from "@headlessui/react";
import AddCardIcon from "@icons/add-card.svg?react";
import DeckIcon from "@icons/deck.svg?react";
import WarbandIcon from "@icons/warband.svg?react";
import { Children, PropsWithChildren, useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import { generateDeckId } from "shared/helpers";
import { FighterCardsPortal } from "@components/FighterCardsPortal";
import { useBreakpoint } from "@hooks/useMediaQuery";
import useAuthUser from "@hooks/useAuthUser";
import { useDeckBuilderDispatcher, useDeckBuilderState } from "@store/deckBuilder";
import { resetDeckAction, saveDeckAction } from "@store/deckBuilder/actions";
import { BottomPanelNavigation, Tab } from "@/components/BottomPanelNavigation";
import { FightersInfoList } from "@/components/FightersInfoList";

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

const tabs: Tab[] = [
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

const MobileLayout = ({ children }: PropsWithChildren) => {
  const childrenArray = Children.toArray(children);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

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

function DeckCreator() {
  const isMobile = useBreakpoint("mobile");
  const [deckId, setDeckId] = useState("");
  const [deckName, setDeckName] = useState("");
  const [showWarband, setShowWarband] = useState(false);
  const [showConfirmDeckReset, setShowConfirmDeckReset] = useState(false);
  const { uid, displayName } = useAuthUser() || {
    uid: "Anonymous",
    displayName: "Anonymous",
  };

  const { faction, status } = useDeckBuilderState();
  const dispatch = useDeckBuilderDispatcher();

  useEffect(() => {
    setDeckId(generateDeckId(faction.abbr));
  }, [faction]);

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
    dispatch(
      saveDeckAction({
        deckName: deckName || `${faction.displayName} Deck`,
        author: uid,
        authorDisplayName: displayName,
        deckId,
      }),
    );
  };

  // Navigate after successful save
  if (status === "Saved") {
    // Use TanStack Router navigation here
    return null; // or loading state
  }

  return (
    <div className="flex-1 grid grid-cols-1 lg:pb-0 lg:grid-cols-4 bg-white relative">
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
          <FightersInfoList factionName={faction.name} />
        </MobileLayout>
      )}

      {!isMobile && (
        <>
          <CardsLibraryWithFilters />
          <div className="lg:col-span-3 p-2 pt-4">
            <div className="hidden lg:flex lg:flex-row-reverse lg:w-full lg:p-4">
              <FighterCardsPortal faction={faction.name} />
            </div>

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
            <FightersInfoList factionName={faction.name} onClose={() => setShowWarband(false)} />
          </Transition>
        </>
      )}

      <DeleteConfirmationDialog
        title="Clear current deck"
        description="Are you sure you want to clear current deck? Your deck building progress will be lost."
        open={showConfirmDeckReset}
        onCloseDialog={handleCloseConfirmDialog}
        onDeleteConfirmed={handleResetDeck}
        onDeleteRejected={handleCloseConfirmDialog}
      />
    </div>
  );
}

export const Route = createLazyFileRoute('/decks/create/')({
  component: DeckCreator
})

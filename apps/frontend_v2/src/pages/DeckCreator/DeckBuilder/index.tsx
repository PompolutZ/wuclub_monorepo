import { DeleteConfirmationDialog } from "@components/DeleteConfirmationDialog";
import AddCardIcon from "@icons/add-card.svg?react";
import DeckIcon from "@icons/deck.svg?react";
import WarbandIcon from "@icons/warband.svg?react";
import React, { Children, useMemo, useState } from "react";
import { Navigate, useParams } from "@tanstack/react-router";
import useMeasure from "react-use-measure";
import { generateDeckId } from "shared/helpers";
import { useDeckBuilderDispatcher, useDeckBuilderState } from "..";
import FightersInfoList from "../../../atoms/FightersInfoList";
import { factions } from "@fxdxpz/wudb";
import useAuthUser from "../../../hooks/useAuthUser";
import { useBreakpoint } from "../../../hooks/useMediaQuery";
import BottomPanelNavigation from "../../../shared/components/BottomPanelNavigation";
import { FighterCardsPortal } from "../../../shared/components/FighterCardsPortal";
import {
  resetDeckAction,
  saveDeckAction,
  updateDeckAction,
  STATUS_SAVED,
} from "../reducer";
import type { CardFilter } from "../reducer";
import CardLibraryToggles from "./components/CardLibraryFilters";
import CardsLibrary from "./components/CardsLibrary";
import Deck from "./components/Deck";
import LibraryFilters from "./components/LibraryFilters";

function CardsLibraryWithFilters() {
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState<CardFilter>({});
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

type TabIconProps = { className?: string };

const tabs = (factionId: string) => [
  {
    name: "Library",
    Icon: ({ className }: TabIconProps) => (
      <AddCardIcon className={className} />
    ),
  },
  {
    name: "Deck",
    Icon: ({ className }: TabIconProps) => <DeckIcon className={className} />,
  },
  {
    name: "Warband",
    Icon: ({ className }: TabIconProps) => (
      <WarbandIcon className={className} />
    ),
    disabled: factionId === factions["u"].id,
  },
];

interface MobileViewProps {
  children: React.ReactNode;
  factionId: string;
}

const MobileView = ({ children, factionId }: MobileViewProps) => {
  const isMobile = useBreakpoint("mobile");
  const { action } = useParams({ strict: false }) as { action?: string };
  const childrenArray = Children.toArray(children);
  const [activeTabIndex, setActiveTabIndex] = useState(
    action && action !== "create" ? 1 : 0,
  );

  if (!isMobile) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 flex">{childrenArray[activeTabIndex]}</div>
      <BottomPanelNavigation
        tabs={tabs(factionId)}
        activeTabIndex={activeTabIndex}
        setActiveTabIndex={setActiveTabIndex}
      />
    </div>
  );
};

const DesktopView = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useBreakpoint("mobile");
  return !isMobile ? children : null;
};

interface DeckBuilderProps {
  currentDeckName?: string;
  existingDeckId?: string;
  isPrivate?: boolean;
}

function DeckBuilder({
  currentDeckName,
  existingDeckId,
  isPrivate,
}: DeckBuilderProps) {
  const [deckName, setDeckName] = useState(currentDeckName || "");
  const [showConfirmDeckReset, setShowConfirmDeckReset] = useState(false);
  const { uid, displayName } = (useAuthUser() as {
    uid?: string;
    displayName?: string;
  } | null) || {
    uid: "Anonymous",
    displayName: "Anonymous",
  };
  const { faction, status } = useDeckBuilderState();
  const dispatch = useDeckBuilderDispatcher();
  const deckId = useMemo(() => {
    return existingDeckId ?? generateDeckId(faction.abbr);
  }, [existingDeckId, faction.abbr]);

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

  if (status === STATUS_SAVED) {
    return <Navigate to="/mydecks" />;
  }

  return (
    <div className="flex-1 grid grid-cols-1 lg:pb-0 lg:grid-cols-4 bg-white relative">
      <MobileView factionId={faction.id}>
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
      </MobileView>

      <DesktopView>
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
      </DesktopView>

      <DeleteConfirmationDialog
        title="Clear current deck"
        description={
          "Are you sure you want to clear current deck? Your deck building progress will be lost."
        }
        open={showConfirmDeckReset}
        onCloseDeleteDialog={handleCloseConfirmDialog}
        onDeleteConfirmed={handleResetDeck}
        onDeleteRejected={handleCloseConfirmDialog}
      />
    </div>
  );
}

export default DeckBuilder;

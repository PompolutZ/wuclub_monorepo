import { LazyLoading } from "@/components/LazyLoading";
import { useUpdateDeck } from "@/shared/hooks/useUpdateDeck";
import { useDeleteDeck } from "@/shared/hooks/useDeleteDeck";
import { DeckPlayFormatsValidity } from "@components/DeckPlayFormatsValidity";
import { lazy, memo, Suspense, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import ScoringOverview from "../../../atoms/ScoringOverview";
import { ModalPresenter } from "../../../main";
import { CardListSectionHeader } from "../../../shared/components/CardListSectionHeader";
import DeleteConfirmationDialog from "../../../atoms/DeleteConfirmationDialog";
import { logger } from "@/utils/logger";
import Card from "./atoms/Card";
import { Toast } from "./atoms/Toast";
import { DeckPlotCards } from "./atoms/DeckPlotCards";
import DeckSummary from "./DeckSummary";
import { FighterCardsPortal } from "@/shared/components/FighterCardsPortal";
import { DeckProvider } from "./context";
import { DeckActions } from "./atoms/DeckActions";
import type { ReadonlyDeckProps, CardsSectionContentProps } from "./types";
import { useDeckData } from "./hooks/useDeckData";
import { useObjectiveSummary } from "./hooks/useObjectiveSummary";
import { exportToUDB, createShareableLink, saveVassalFormat } from "./utils/deckExport";
import { getFormattedDate } from "./utils/displayHelpers";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import BottomPanelNavigation from "@components/BottomPanelNavigation";
import FightersInfoList from "../../../atoms/FightersInfoList";
import DeckIcon from "@icons/deck.svg?react";
import WarbandIcon from "@icons/warband.svg?react";
import GloryIcon from "@icons/wu-glory.svg?react";
import { factions } from "@wudb/factions";

const CardProxyMaker = lazy(() => import("../CardProxyMaker"));

const MOBILE_TABS = (factionId: string) => [
  { name: "Deck", Icon: DeckIcon },
  { name: "Warband", Icon: WarbandIcon, disabled: factionId === factions["u"].id },
];

const CardsSectionContent = memo(function CardsSectionContent({ cards, listView }: CardsSectionContentProps) {
  return listView ? (
    <ul className="px-3">
      {cards.map((v) => (
        <Card key={v.id} card={v} />
      ))}
    </ul>
  ) : (
    <div className="flex flex-wrap max-w-7xl mx-auto">
      {cards.map((v) => (
        <Card asImage key={v.id} card={v} />
      ))}
    </div>
  );
});

function ReadonlyDeck(props: ReadonlyDeckProps) {
  const {
    id,
    name,
    factionId,
    faction,
    cards,
    sets,
    created,
    createdutc,
    updatedutc,
  } = props;

  const history = useHistory();
  const isMobile = useBreakpoint("mobile");
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isPrivate, setIsPrivate] = useState(props.private);
  const [isProxyPickerVisible, setIsProxyPickerVisible] = useState(false);
  const [cardsView, setCardsView] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState<string | null>(null);

  const { mutateAsync: update } = useUpdateDeck();
  const { mutateAsync: deleteUserDeck } = useDeleteDeck();

  const deck = useDeckData({ id, name, factionId, faction, sets, created, createdutc, updatedutc, isPrivate, cards });

  const { summary: objectiveSummary, totalGlory } = useObjectiveSummary(deck.objectives);
  const totalUpgradesGlory = useMemo(() => deck.upgrades.reduce((sum, c) => sum + Number(c.glory ?? 0), 0), [deck.upgrades]);

  const toggleDeckPrivacy = () => {
    const nextState = !isPrivate;
    setIsPrivate(nextState);
    update({ deckId: id, deck: { private: nextState } });
  };

  const handleShowToast = (text: string) => {
    setToastContent(text);
    setShowToast(true);
  };

  const resetToast = () => {
    setShowToast(false);
    setToastContent(null);
  };

  const handleDeleteDeck = async () => {
    try {
      await deleteUserDeck(id);
      setIsDeleteDialogVisible(false);
      history.replace({
        pathname: "/mydecks",
        state: { deck: { deckId: id, name }, status: "DELETED" },
      });
    } catch (e) {
      logger.error("Failed to delete deck", e as Error, { deckId: id });
      handleShowToast("Failed to delete deck. Please try again.");
    }
  };

  const createdDate = getFormattedDate(updatedutc, created);

  const cardSections = (
    <div
      className={`mt-4 lg:mt-8 mb-8 ${
        cardsView ? "" : "lg:grid lg:gap-2 lg:grid-cols-3"
      }`}
    >
      <section className="px-4">
        <CardListSectionHeader
          className="px-2"
          type={"Objectives"}
          amount={deck.objectives.length}
        >
          <ScoringOverview summary={objectiveSummary} glory={totalGlory} />
        </CardListSectionHeader>
        <CardsSectionContent cards={deck.objectives} listView={!cardsView} />
      </section>
      <section className="mt-4 lg:mt-0 px-4">
        <CardListSectionHeader
          className="px-2"
          type={"Gambits"}
          amount={deck.gambits.length}
        />
        <CardsSectionContent cards={deck.gambits} listView={!cardsView} />
      </section>
      <section className="mt-4 lg:mt-0 px-4">
        <CardListSectionHeader
          className="px-2"
          type={"Upgrades"}
          amount={deck.upgrades.length}
        >
          <div className="flex items-center ml-2 text-sm text-gray-800">
            <GloryIcon className="bg-gray-400 rounded-full w-5 h-5 fill-current" />
            {totalUpgradesGlory}
          </div>
        </CardListSectionHeader>
        <CardsSectionContent cards={deck.upgrades} listView={!cardsView} />
      </section>
    </div>
  );

  return (
    <DeckProvider
      value={{
        deckId: id,
        deck,
        canUpdateOrDelete: props.canUpdateOrDelete,
        isPrivate,
        cardsView,
        toggleDeckPrivacy,
        onDelete: () => setIsDeleteDialogVisible(true),
        onCardsViewChange: () => setCardsView((prev) => !prev),
        exportToUDB: () => exportToUDB(cards),
        createShareableLink: () => createShareableLink(cards, handleShowToast),
        copyInVassalFormat: () => saveVassalFormat(faction, cards, handleShowToast),
        onDownloadProxy: () => setIsProxyPickerVisible(true),
      }}
    >
      {isMobile ? (
        <div className="flex flex-col h-full">
          <div className="flex-1 flex overflow-hidden min-h-0">
            {activeTabIndex === 0 && (
              <div className="flex-1 relative">
                <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
                  <div className="flex px-4">
                    <DeckSummary
                      faction={faction}
                      name={name}
                      date={createdDate}
                      sets={sets}
                      isPrivate={isPrivate}
                    >
                      <div className="ml-4">
                        <DeckPlayFormatsValidity cards={cards} />
                      </div>
                    </DeckSummary>
                    <DeckActions />
                  </div>
                  <div className="p-4">
                    <DeckPlotCards factionId={faction} sets={sets} />
                  </div>
                  {cardSections}
                </div>
              </div>
            )}
            {activeTabIndex === 1 && <FightersInfoList factionName={faction} />}
          </div>

          <BottomPanelNavigation
            tabs={MOBILE_TABS(factionId)}
            activeTabIndex={activeTabIndex}
            setActiveTabIndex={setActiveTabIndex}
          />
        </div>
      ) : (
        <div className="flex-1 w-screen">
          <div className="flex px-4">
            <DeckSummary
              faction={faction}
              name={name}
              date={createdDate}
              sets={sets}
              isPrivate={isPrivate}
            >
              <div className="ml-4">
                <DeckPlayFormatsValidity cards={cards} />
              </div>
            </DeckSummary>
            <DeckActions />
          </div>

          <div className="p-4 flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
            <DeckPlotCards factionId={faction} sets={sets} />
            <FighterCardsPortal faction={faction} />
          </div>

          {cardSections}
        </div>
      )}

      {isProxyPickerVisible && (
        <ModalPresenter>
          <Suspense fallback={<LazyLoading />}>
            <CardProxyMaker
              factionId={faction}
              cards={cards as any}
              onExit={() => setIsProxyPickerVisible(false)}
            />
          </Suspense>
        </ModalPresenter>
      )}

      <Toast
        className="border-purple-700 border-2 bg-purple-100 font-bold p-4 text-purple-700 text-xs lg:text-default rounded-md shadow-md"
        show={showToast}
        onTimeout={resetToast}
      >
        {toastContent}
      </Toast>

      <DeleteConfirmationDialog
        title="Delete deck"
        description={`Are you sure you want to delete deck: '${name}'`}
        open={isDeleteDialogVisible}
        onCloseDeleteDialog={() => setIsDeleteDialogVisible(false)}
        onDeleteConfirmed={handleDeleteDeck}
        onDeleteRejected={() => setIsDeleteDialogVisible(false)}
      />
    </DeckProvider>
  );
}

export default ReadonlyDeck;

import { LazyLoading } from "@/components/LazyLoading";
import { useUpdateDeck } from "@/shared/hooks/useUpdateDeck";
import { DeckPlayFormatsValidity } from "@components/DeckPlayFormatsValidity";
import * as clipboard from "clipboard-polyfill";
import { Set } from "immutable";
import { lazy, Suspense, useState } from "react";
import ScoringOverview from "../../../atoms/ScoringOverview";
import {
  checkCardIsObjective,
  checkCardIsPloy,
  checkCardIsUpgrade,
  compareObjectivesByScoreType,
} from "../../../data/wudb";
import { ModalPresenter } from "../../../main";
import { CardListSectionHeader } from "../../../shared/components/CardListSectionHeader";
import Card from "./atoms/Card";
import { DeckPlotCards } from "./atoms/DeckPlotCards";
import DeckSummary from "./DeckSummary";
import { FighterCardsPortal } from "@/shared/components/FighterCardsPortal";

const DeckActionsMenu = lazy(() => import("./atoms/DeckActionsMenu"));
const DeckActionMenuLarge = lazy(() => import("./atoms/DeckActionsMenuLarge"));
const CardProxyMaker = lazy(() => import("../CardProxyMaker"));

function CardsSectionContent({ cards, listView }) {
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
}

function ReadonlyDeck(props) {
  const {
    id,
    name,
    author,
    faction,
    cards,
    sets,
    created,
    createdutc,
    updatedutc,
  } = props;
  const [isPrivate, setIsPrivate] = useState(props.private);
  const [isProxyPickerVisible, setIsProxyPickerVisible] = useState(false);
  const { mutateAsync: update } = useUpdateDeck();

  const handleExportToUDB = () => {
    const deckFormat =
      new Set(props.cards.map((card) => card.setId)).size > 1
        ? "nemesis"
        : "rivals";

    const udbEncodedCards = props.cards
      .map((card) => `${card.id}`)
      .sort()
      .join();
    window.open(
      `https://www.underworldsdb.com/shared.php?deck=0,${udbEncodedCards}&format=${deckFormat}`,
    );
  };

  const handleCreateShareableLink = () => {
    const link = `${
      import.meta.env.VITE_BASE_URL
    }/deck/transfer/wuc,${props.cards.map((card) => card.id).join(",")}`;
    clipboard.writeText(link);
    props.showToast("Link copied to clipboard!");
  };

  const handleSaveVassalFiles = (faction, cards) => () => {
    const cardList = `${faction}\r\n${cards.map((card) => card.id).join(",")}`;
    clipboard.writeText(cardList);
    props.showToast("Deck copied to clipboard!");
  };

  const toggleDeckPrivacy = () => {
    const nextState = !isPrivate;
    setIsPrivate(nextState);

    update({
      deckId: id,
      deck: {
        private: nextState,
      },
    });
  };

  const [userInfo] = props.userInfo || [];
  const authorDisplayName = userInfo ? userInfo.displayName : "Anonymous";

  const objectives = cards
    .filter(checkCardIsObjective)
    .sort((a, b) => compareObjectivesByScoreType(a.scoreType, b.scoreType));

  const gambits = cards
    .filter(checkCardIsPloy)
    .sort((a, b) => a.name.localeCompare(b.name));

  const upgrades = cards
    .filter(checkCardIsUpgrade)
    .sort((a, b) => a.name.localeCompare(b.name));

  const deck = {
    id,
    name,
    author,
    faction,
    sets,
    created,
    createdutc,
    updatedutc,
    objectives,
    gambits,
    upgrades,
    private: isPrivate,
  };

  const createdDate = updatedutc
    ? `${new Date(updatedutc).toLocaleDateString()}`
    : created
      ? `${new Date(created).toLocaleDateString()}`
      : "";

  const objectiveSummary = new Set(objectives)
    .groupBy((c) => c.scoreType)
    .reduce(
      (r, v, k) => {
        r[k] = v.count();
        return r;
      },
      [0, 0, 0, 0],
    );

  const totalGlory = objectives.reduce((acc, c) => acc + Number(c.glory), 0);

  return (
    <div className="flex-1 w-screen">
      <div className="flex px-4">
        <DeckSummary
          faction={faction}
          name={name}
          author={authorDisplayName}
          date={createdDate}
          sets={sets}
          isPrivate={isPrivate}
        >
          <div className="ml-4">
            <DeckPlayFormatsValidity cards={cards} />
          </div>
        </DeckSummary>
        <>
          <div className="lg:hidden">
            <DeckActionsMenu
              deck={deck}
              deckId={id}
              canUpdateOrDelete={props.canUpdateOrDelete}
              exportToUDB={handleExportToUDB}
              createShareableLink={handleCreateShareableLink}
              onDelete={props.onDelete}
              onToggleDeckPrivacy={toggleDeckPrivacy}
              isPrivate={isPrivate}
            />
          </div>
          <div className="hidden lg:flex items-center">
            <DeckActionMenuLarge
              cardsView={props.cardsView}
              onCardsViewChange={props.onCardsViewChange}
              copyInVassalFormat={handleSaveVassalFiles(faction, cards)}
              canUpdateOrDelete={props.canUpdateOrDelete}
              deck={deck}
              deckId={id}
              exportToUDB={handleExportToUDB}
              createShareableLink={handleCreateShareableLink}
              onDelete={props.onDelete}
              onToggleDeckPrivacy={toggleDeckPrivacy}
              isPrivate={isPrivate}
              onDownloadProxy={() => setIsProxyPickerVisible(true)}
            />
          </div>
        </>
      </div>

      <div className="p-4 flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
        <DeckPlotCards factionId={faction} sets={sets} />
        <FighterCardsPortal faction={faction} />
      </div>

      <div
        className={`mt-4 lg:mt-8 mb-8 ${
          props.cardsView ? "" : "lg:grid lg:gap-2 lg:grid-cols-3"
        }`}
      >
        <section className="px-4">
          <CardListSectionHeader
            className="px-2"
            type={"Objectives"}
            amount={objectives.length}
          >
            <ScoringOverview summary={objectiveSummary} glory={totalGlory} />
          </CardListSectionHeader>
          <CardsSectionContent cards={objectives} listView={!props.cardsView} />
        </section>
        <section className="mt-4 lg:mt-0 px-4">
          <CardListSectionHeader
            className="px-2"
            type={"Gambits"}
            amount={gambits.length}
          />
          <CardsSectionContent cards={gambits} listView={!props.cardsView} />
        </section>
        <section className="mt-4 lg:mt-0 px-4">
          <CardListSectionHeader
            className="px-2"
            type={"Upgrades"}
            amount={upgrades.length}
          />
          <CardsSectionContent cards={upgrades} listView={!props.cardsView} />{" "}
        </section>
      </div>

      {isProxyPickerVisible && (
        <ModalPresenter>
          <Suspense fallback={<LazyLoading />}>
            <CardProxyMaker
              factionId={faction}
              cards={cards}
              onExit={() => setIsProxyPickerVisible(false)}
            ></CardProxyMaker>
          </Suspense>
        </ModalPresenter>
      )}
    </div>
  );
}

export default ReadonlyDeck;

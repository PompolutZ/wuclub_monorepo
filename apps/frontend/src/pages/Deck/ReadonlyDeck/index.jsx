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
  udbPrefexes,
} from "../../../data/wudb";
import { ModalPresenter } from "../../../main";
import { CardListSectionHeader } from "../../../shared/components/CardListSectionHeader";
import Card from "./atoms/Card";
import { DeckPlotCards } from "./atoms/DeckPlotCards";
import DeckSummary from "./DeckSummary";

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
    const invertedPrefixes = Object.entries(udbPrefexes).reduce(
      (acc, [prefix, wave]) => ({ ...acc, [wave]: prefix }),
      { 1: "" },
    );

    const encodeToUDB = (card) => {
      const udbPrefix = invertedPrefixes[Math.floor(Number(card) / 1000)];

      return `${udbPrefix}${Number(card) % 1000}`;
    };

    const udbEncodedCards = props.cards
      .map((card) => `${card.id}`.padStart(5, "0"))
      .map(encodeToUDB)
      .sort()
      .join();
    window.open(
      `https://www.underworldsdb.com/shared.php?deck=0,${udbEncodedCards}`,
    );
  };

  const handleCreateShareableLink = () => {
    const link = `${
      import.meta.env.VITE_BASE_URL
    }/deck/transfer/wuc,${props.cards.map((card) => card.id).join(",")}`;
    clipboard.writeText(link);
    props.showToast("Link copied to clipboard!");
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
              onSaveVassalFiles={handleSaveVassalFiles(name, cards)}
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

      <DeckPlotCards factionId={faction} sets={sets} />

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

const vassalPrefixMap = {
  23: 230,
  24: 231,
  25: 232,
  26: 233,
  27: 234,
  28: 235,
  29: 240,
  31: 236,
  32: 237,
  33: 251,
  34: 250,
  35: 252,
  36: 253,
  37: 254,
  38: 255,
  39: 256,
  40: 257,
  41: 260,
  42: 261,
  43: 262,
  44: 263,
};

const handleSaveVassalFiles = (name, cards) => () => {
  const objectives = cards
    .filter(({ type }) => type === "Objective")
    .map((c) => {
      if (c.id >= 30000 && c.id <= 31000) {
        // handle special case:
        // Sepulchral Guard REMASTERED = 24001 to 24032
        // Farstriders REMASTERED = 24033 to 24064
        const cardIdx = c.id % 100;
        return [240 + `${32 + cardIdx}`.padStart(2, "0"), c.name];
      }
      if (c.id >= 23000) {
        const prefix = Math.floor(c.id / 1000);
        const cardIdx = c.id % 100;

        return [
          vassalPrefixMap[prefix] + `${cardIdx}`.padStart(2, "0"),
          c.name,
        ];
      }

      return [`${c.id}`.padStart(5, "0"), c.name];
    })
    .map(
      ([cardId, name], i) =>
        '+/1660398120521/mark;RealCardName	restrict;PLAYER 1,PLAYER 2;false;false;\\	hideCmd;P2;Disable;PlayerOwnership = PLAYER1 && PlayerSide = PLAYER 2;70\\,130,44\\,650\\\\	hideCmd;P1;Disable;PlayerOwnership = PLAYER2 && PlayerSide = PLAYER 1;70\\,130,44\\,650\\\\\\	hideCmd;OBSERVER;Disable;{GetProperty("PlayerSide = <observer")>};70\\,130\\\\\\\\	macro;Puts back;;;DeckName = OBJECTIVE CARDS LEFT WIDE || DeckName = OBJECTIVE CARDS RIGHT WIDE;74\\,715;74\\,585;false;;;counted;;;;false;;1;1\\\\\\\\\\	report;74\\,585;$PlayerName$ puts back an OBJECTIVE CARD;;;Puts back;false\\\\\\\\\\\\	macro;Location is not offboard;;;OldLocationName = OBJECTIVE CARDS LEFT WIDE || OldLocationName = OBJECTIVE CARDS RIGHT WIDE;74\\,715;74\\,195;false;;;counted;;;;false;;1;1\\\\\\\\\\\\\\	macro;Make playerside 2;;74,715;PlayerSide = PLAYER 2 && PlayerOwnership = NONE;;40\\,130;false;;;counted;;;;false;;1;1\\\\\\\\\\\\\\\\	macro;Make playerside 1;;74,715;PlayerSide = PLAYER 1 && PlayerOwnership = NONE;;35\\,130;false;;;counted;;;;false;;1;1\\\\\\\\\\\\\\\\\\	report;74\\,195;`$PlayerName$ draws an OBJECTIVE CARD;;;;false\\\\\\\\\\\\\\\\\\\\	PROP;PlayerOwnership;false,0,100,false;:35\\,130:P\\,PLAYER1,:40\\,130:P\\,PLAYER2;\\\\\\\\\\\\\\\\\\\\\\	macro;p2 Mulligan;;44,650;PlayerOwnership = PLAYER2 && ObscuredToOthers = false;;98\\,130;false;;;counted;;;;false;;1;1\\\\\\\\\\\\\\\\\\\\\\\\	macro;p1 Mulligan;;44,650;{(PlayerOwnership=="PLAYER1") && (ObscuredToOthers==false)};;97\\,130;false;;;counted;;;;false;;1;1\\\\\\\\\\\\\\\\\\\\\\\\\\	macro;p2 return to deck;;72,130;PlayerOwnership = PLAYER2;;98\\,130;false;;;counted;;;;false;;1;1\\\\\\\\\\\\\\\\\\\\\\\\\\\\	macro;p1 return to deck;;72,130;PlayerOwnership = PLAYER1;;97\\,130;false;;;counted;;;;false;;1;1\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	return;;98,130;OBJECTIVE CARDS RIGHT WIDE;Select destination;;2;false;OBJECTIVE CARDS RIGHT WIDE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	return;;97,130;OBJECTIVE CARDS LEFT WIDE;Select destination;;2;false;OBJECTIVE CARDS LEFT WIDE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	obs;70,130;Objectives background.png;REVEAL;GHiddnoverlay 2.png;?;player:;Peek;;false;;\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	report;68\\,195;$PlayerName$ Deleted: $PieceName$;;;INFORME TIRADA;false\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	immob;g;N;R;\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	mark;MapLayers\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	delete;Delete;68,195;\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	piece;;;' +
        cardId +
        ".png;" +
        cardId +
        "/" +
        name +
        "	\\	\\\\	\\\\\\	\\\\\\\\	\\\\\\\\\\	-1\\\\\\\\\\\\	\\\\\\\\\\\\\\	\\\\\\\\\\\\\\\\	\\\\\\\\\\\\\\\\\\	-1\\\\\\\\\\\\\\\\\\\\	NONE\\\\\\\\\\\\\\\\\\\\\\	\\\\\\\\\\\\\\\\\\\\\\\\	\\\\\\\\\\\\\\\\\\\\\\\\\\	\\\\\\\\\\\\\\\\\\\\\\\\\\\\	\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	null;\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	-1\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	CardsLayers\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	null;2852;244;" +
        i +
        ";6;OldZone;;OldLocationName;;OldX;2824;OldY;900;OldBoard;BOARD WIDE;OldMap;",
    );

  const powers = cards
    .filter(({ type }) => type !== "Objective")
    .map((c) => {
      if (c.id >= 23000) {
        const prefix = Math.floor(c.id / 1000);
        const cardIdx = c.id % 100;

        return [
          vassalPrefixMap[prefix] + `${cardIdx}`.padStart(2, "0"),
          c.name,
        ];
      }

      return [`${c.id}`.padStart(5, "0"), c.name];
    })
    .map(
      ([cardId, name], i) =>
        '+/1660396530624/mark;RealCardName	restrict;PLAYER 1,PLAYER 2;false;false;\\	hideCmd;P2;Disable;PlayerOwnership = PLAYER1 && PlayerSide = PLAYER 2;70\\,130,44\\,650\\\\	hideCmd;P1;Disable;PlayerOwnership = PLAYER2 && PlayerSide = PLAYER 1;70\\,130,44\\,650\\\\\\	hideCmd;OBSERVER;Disable;{GetProperty("PlayerSide = <observer")>};70\\,130\\\\\\\\	macro;Puts back;;;DeckName = POWER CARDS LEFT WIDE || DeckName = POWER CARDS RIGHT WIDE;74\\,715;74\\,585;false;;;counted;;;;false;;1;1\\\\\\\\\\	report;74\\,585;$PlayerName$ puts back a POWER CARD;;;Puts back;false\\\\\\\\\\\\	macro;Location is not offboard;;;OldLocationName = POWER CARDS LEFT WIDE || OldLocationName = POWER CARDS RIGHT WIDE;74\\,715;74\\,195;false;;;counted;;;;false;;1;1\\\\\\\\\\\\\\	macro;Make playerside 2;;74,715;PlayerSide = PLAYER 2 && PlayerOwnership = NONE;;40\\,130;false;;;counted;;;;false;;1;1\\\\\\\\\\\\\\\\	macro;Make playerside 1;;74,715;PlayerSide = PLAYER 1 && PlayerOwnership = NONE;;35\\,130;false;;;counted;;;;false;;1;1\\\\\\\\\\\\\\\\\\	report;74\\,195;`$PlayerName$ draws a POWER CARD;;;;false\\\\\\\\\\\\\\\\\\\\	PROP;PlayerOwnership;false,0,100,false;:35\\,130:P\\,PLAYER1,:40\\,130:P\\,PLAYER2;\\\\\\\\\\\\\\\\\\\\\\	macro;p2 Mulligan;;44,650;PlayerOwnership = PLAYER2 && ObscuredToOthers = false;;98\\,130;false;;;counted;;;;false;;1;1\\\\\\\\\\\\\\\\\\\\\\\\	macro;p1 Mulligan;;44,650;{(PlayerOwnership=="PLAYER1") && (ObscuredToOthers==false)};;97\\,130;false;;;counted;;;;false;;1;1\\\\\\\\\\\\\\\\\\\\\\\\\\	macro;p2 return to deck;;72,130;PlayerOwnership = PLAYER2;;98\\,130;false;;;counted;;;;false;;1;1\\\\\\\\\\\\\\\\\\\\\\\\\\\\	macro;p1 return to deck;;72,130;PlayerOwnership = PLAYER1;;97\\,130;false;;;counted;;;;false;;1;1\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	return;;98,130;POWER CARDS RIGHT WIDE;Select destination;;2;false;POWER CARDS RIGHT WIDE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	return;;97,130;POWER CARDS LEFT WIDE;Select destination;;2;false;POWER CARDS LEFT WIDE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	obs;70,130;powercardsback.png;REVEAL;GHiddnoverlay 2.png;?;player:;Peek;;false;;\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	report;68\\,195;$PlayerName$ Deleted: $PieceName$;;;INFORME TIRADA;false\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	immob;g;N;R;\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	mark;MapLayers\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	delete;Delete;68,195;\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	piece;;;' +
        cardId +
        ".png;" +
        cardId +
        "/" +
        name +
        "	\\	\\\\	\\\\\\	\\\\\\\\	\\\\\\\\\\	-1\\\\\\\\\\\\	\\\\\\\\\\\\\\	\\\\\\\\\\\\\\\\	\\\\\\\\\\\\\\\\\\	-1\\\\\\\\\\\\\\\\\\\\	NONE\\\\\\\\\\\\\\\\\\\\\\	\\\\\\\\\\\\\\\\\\\\\\\\	\\\\\\\\\\\\\\\\\\\\\\\\\\	\\\\\\\\\\\\\\\\\\\\\\\\\\\\	\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	asd123;true|0\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	-1\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	CardsLayers\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	null;2543;244;" +
        i +
        ";6;OldZone;;OldLocationName;;OldX;2508;OldY;948;OldBoard;BOARD WIDE;OldMap;",
    );

  downloadVassalDeckWithTempLink(objectives, `${name}_OBJECTIVES.txt`);
  downloadVassalDeckWithTempLink(powers, `${name}_POWERS.txt`);
};

const downloadVassalDeckWithTempLink = (deck, fileName) => {
  const tempDownloadLink = document.createElement("a");
  tempDownloadLink.style.display = "none";
  document.body.appendChild(tempDownloadLink);
  const content = ["DECK\t", ...deck];

  const file = new Blob(content, { type: "text/plain" });
  tempDownloadLink.href = URL.createObjectURL(file);
  tempDownloadLink.download = fileName;
  tempDownloadLink.click();

  document.body.removeChild(tempDownloadLink);
};

export default ReadonlyDeck;

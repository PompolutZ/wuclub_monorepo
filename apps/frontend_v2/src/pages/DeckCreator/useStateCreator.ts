import { useLocation, useParams } from "@tanstack/react-router";
import {
  CHAMPIONSHIP_FORMAT,
  NEMESIS_FORMAT,
  RIVALS_FORMAT,
  checkCardIsObjective,
  checkCardIsPloy,
  checkCardIsUpgrade,
  getCardById,
  getFactionById,
  getFactionByName,
  getSetById,
} from "@fxdxpz/wudb";
import type { Card, SetId, FactionName } from "@fxdxpz/wudb";
import { INITIAL_STATE } from "./reducer";
import type { DeckBuilderState, Faction } from "./reducer";
import { logger } from "@/utils/logger";

type DeckRouteState = {
  deck?: {
    faction?: string;
    sets?: SetId[];
    objectives?: DeckBuilderState["selectedObjectives"];
    gambits?: DeckBuilderState["selectedGambits"];
    upgrades?: DeckBuilderState["selectedUpgrades"];
    name?: string;
    private?: boolean;
  };
};

type PreviousDeck = {
  id: string | undefined;
  name: string | undefined;
  private: boolean | undefined;
};

type StateCreatorResult =
  | { action: string | undefined; state: null; previous?: undefined }
  | { action: string; state: DeckBuilderState; previous?: PreviousDeck };

export function useStateCreator(): StateCreatorResult {
  const { action, data } = useParams({ strict: false }) as {
    action?: string;
    data?: string;
  };
  const state = useLocation({
    select: (loc) => loc.state as unknown as DeckRouteState | null,
  });

  switch (action) {
    case "create":
      return { action, state: null };

    case "edit": {
      const deckSets = (state?.deck?.sets ?? [])
        .map((setId) => getSetById(setId as never)!)
        .filter(Boolean);
      const editFormat =
        deckSets.length === 1
          ? RIVALS_FORMAT
          : deckSets.length === 2
            ? NEMESIS_FORMAT
            : INITIAL_STATE.format;
      return {
        action,
        state: {
          ...INITIAL_STATE,
          format: editFormat,
          sets: deckSets.length > 0 ? deckSets : INITIAL_STATE.sets,
          faction: (getFactionByName(state?.deck?.faction as FactionName) ??
            INITIAL_STATE.faction) as Faction,
          selectedObjectives: state?.deck?.objectives ?? [],
          selectedGambits: state?.deck?.gambits ?? [],
          selectedUpgrades: state?.deck?.upgrades ?? [],
        },
        previous: {
          id: data,
          name: state?.deck?.name,
          private: state?.deck?.private,
        },
      };
    }

    case "transfer": {
      const [transferFormat, ...cardIds] = (data ?? "").split(",");
      const decode = getDecodingFunction(transferFormat);
      const decodedCards = cardIds
        .map((foreignId) => {
          const wuid = decode(foreignId);
          const card = getCardById(wuid as never);
          if (!card) {
            logger.warn(`Card with ID ${wuid} not found in the database`, {
              wuid,
              foreignId,
            });
            return null;
          }
          return card as unknown as Card;
        })
        .filter(Boolean) as Card[];

      const faction = getFactionById();

      const sets = decodedCards.reduce(
        (acc, card) => acc.add(card.setId),
        new Set<SetId>(),
      );

      const selectedSets = [...sets.values()];

      return {
        action,
        state: {
          ...INITIAL_STATE,
          format:
            selectedSets.length === 2 ? NEMESIS_FORMAT : CHAMPIONSHIP_FORMAT,
          faction,
          sets: selectedSets.map((setId) => getSetById(setId as never)!),
          selectedObjectives: decodedCards.filter(
            checkCardIsObjective,
          ) as Card[],
          selectedGambits: decodedCards.filter(checkCardIsPloy) as Card[],
          selectedUpgrades: decodedCards.filter(checkCardIsUpgrade) as Card[],
        },
      };
    }

    default:
      logger.warn(`Unknown DeckCreator action: ${action}`);
      return { action, state: null };
  }
}

type DecodeFn = (card: string) => string;

const decodeUDS: DecodeFn = (card) => {
  const udsId = Number(card);
  if (udsId >= 9000 && udsId < 10000) {
    return String(Number(card) + 2000).padStart(5, "0");
  } else if (udsId >= 10000 && udsId < 11000) {
    return String(Number(card)).padStart(5, "0");
  }
  return String(Number(card) + 1000).padStart(5, "0");
};

const decodeWUC: DecodeFn = (card) => card;

const decodeUDB: DecodeFn = (card) => card;

const getDecodingFunction = (encoding: string): DecodeFn => {
  switch (encoding) {
    case "udb":
      return decodeUDB;
    case "uds":
      return decodeUDS;
    case "wuc":
      return decodeWUC;
    default:
      throw Error(`Unknown encoding format: ${encoding}`);
  }
};

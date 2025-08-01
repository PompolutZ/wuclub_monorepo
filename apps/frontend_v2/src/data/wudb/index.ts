import { sortByIdAsc } from "../../utils/sort";
import { factions } from "./factions";
import { sets } from "./sets";
import { cards } from "./cards";
import type {
  Card,
  CardId,
  CardType,
  FactionAbbr,
  FactionName,
  ScoreType,
  Set,
  SetId,
} from "./types";
import { factionMembers } from "./factionMembers";
import { is } from "immutable";

export const latestSeasonStartNumber = 15000;

export const RIVALS_DECK_CARDS_TOTAL = 32;

export const sortedFactions = Object.values(factions).sort(sortByIdAsc);

// export const udbPrefexes = {
//   L: 2,
//   NM: 14,
//   N: 3,
//   P: 4,
//   DC: 9,
//   D: 5,
//   B: 6,
//   G: 7,
//   AM: 12,
//   A: 8,
//   S: 10,
//   E: 11,
//   H: 13,
//   GP: 15,
//   SV: 16,
//   DD: 17,
//   TC: 18,
//   GL: 19,
//   FF: 20,
//   GA: 21,
//   BA: 22,
//   DS: 23,
//   EP: 24,
//   SS: 25,
//   TT: 26,
//   HC: 27,
//   VT: 28,
//   SG: 29,
//   FS: 30,
//   SP: 31,
//   PP: 32,
//   CR: 33,
//   TD: 34,
//   BS: 35,
//   FO: 36,
//   SL: 37,
//   MM: 38,
//   ZG: 39,
//   RR: 40,
//   SW: 41,
//   BQ: 42,
//   ZA: 43,
//   MO: 44,
//   BB: 45,
//   SK: 46,
//   HP: 47,
//   RB: 48,
// };

// export const grouppedFactions = () => {
//   return [
//     {
//       title: "Universal (Any warband)",
//       factions: [
//         factions["Universal"],
//         factions["Order"],
//         factions["Chaos"],
//         factions["Death"],
//         factions["Destruction"],
//       ],
//     },
//     {
//       title: "Wintermaw",
//       factions: sortedFactions.filter(
//         (f) => f.id >= factions["Brethren of the Bolt"].id,
//       ),
//     },
//     {
//       title: "Deathgorge",
//       factions: sortedFactions.filter(
//         (f) =>
//           f.id >= factions["Cyreni's Razors"].id &&
//           f.id <= factions["Zondara's Gravebreakers"].id,
//       ),
//     },
//     {
//       title: "Wyrdhollow",
//       factions: sortedFactions.filter(
//         (f) =>
//           f.id >= factions["Domitan's Stormcoven"].id &&
//           f.id <= factions["Skabbik's Plaguepack"].id,
//       ),
//     },
//     {
//       title: "Gnarlwood",
//       factions: sortedFactions.filter(
//         (f) =>
//           f.id >= factions["Gnarlspirit Pack"].id &&
//           f.id <= factions["Gryselle's Arenai"].id,
//       ),
//     },
//     {
//       title: "Nethermaze",
//       factions: sortedFactions.filter(
//         (f) =>
//           f.id >= factions["Skittershank's Clawpack"].id &&
//           f.id <= factions["Gorechosen of Dromm"].id,
//       ),
//     },
//     {
//       title: "Harrowdeep",
//       factions: sortedFactions.filter(
//         (f) =>
//           f.id >= factions["Xandire's Truthseekers"].id &&
//           f.id <= factions["The Exiled Dead"].id,
//       ),
//     },
//     {
//       title: "Direchasm",
//       factions: sortedFactions.filter(
//         (f) =>
//           f.id >= factions["Myari's Purifiers"].id &&
//           f.id <= factions["Elathain's Soulraid"].id,
//       ),
//     },
//     {
//       title: "Beastgrave",
//       factions: sortedFactions.filter(
//         (f) =>
//           f.id >= factions["Grashrak's Despoilers"].id &&
//           f.id <= factions["Morgok's Krushas"].id,
//       ),
//     },
//     {
//       title: "Nightvault",
//       factions: sortedFactions.filter(
//         (f) =>
//           f.id >= factions["Stormsire's Cursebreakers"].id &&
//           f.id <= factions["Ylthari's Guardians"].id,
//       ),
//     },
//     {
//       title: "Shadespire",
//       factions: sortedFactions.filter(
//         (f) =>
//           f.id >= factions["Garrek's Reavers"].id &&
//           f.id <= factions["The Farstriders"].id,
//       ),
//     },
//     {
//       title: "Starting set",
//       factions: sortedFactions.filter(
//         (f) =>
//           f.id >= factions["Storm of Celestus"].id &&
//           f.id <= factions["Drepur's Wraithcreepers"].id,
//       ),
//     },
//     {
//       title: "Dreadfane",
//       factions: sortedFactions.filter(
//         (f) =>
//           f.id >= factions["Ironsoul's Condemners"].id &&
//           f.id <= factions["Lady Harrow's Mournflight"].id,
//       ),
//     },
//   ];
// };

function getCardNumberFromId(cardId: string) {
  const match = cardId.match(/(\d+)/);
  return match ? +match[1] : null;
}

function getFactionByName(factionName: FactionName) {
  return Object.values(factions).find((f) => f.name == factionName);
}

function getFactionByAbbr(factionAbbr: FactionAbbr) {
  return Object.values(factions).find((f) => f.abbr == factionAbbr);
}

function getFactionById() {
  return factions["u"];
}

// const idToSetKey: Record<SetId, SetName> = {};
function getSetNameById(setId: SetId) {
  return sets[setId]?.name;
  // if (idToSetKey[setId]) {
  //   return idToSetKey[setId];
  // }

  // const [_, value] = Object.entries(sets).find(
  //   ([, { id }]) => id == setId,
  // );

  // if (!value) {
  //   throw new Error(`Set with id ${setId} not found`);
  // }

  // idToSetKey[setId] = value.name;
  // return value.name;
}

const setsWithPlot: SetId[] = [
  sets["RG"].id,
  sets["EK"].id,
  sets["CC"].id,
  sets["RS"].id,
];
export const setHasPlot = (setId: SetId) => {
  return setsWithPlot.includes(setId);
};

function getSetById(setId: SetId) {
  return sets[setId];
}

const cardTypes = ["Objective", "Ploy", "Upgrade", "Spell"];

// This is very stupid but best idea at 22:17 for backward compatibility
function getCardById(cardId: CardId) {
  return cards[cardId];
}

function checkCardIsObjective({ type }: {type: CardType }) {
  return typeof type === "string" && type === "Objective";
}

function checkCardIsPloy({ type }: {type: CardType }) {
  return typeof type === "string" && type === "Ploy";
}

function checkCardIsUpgrade({ type }: {type: CardType }) {
  return typeof type === "string" && type === "Upgrade";
}

const SURGE_SCORE_TYPE = "Surge";
const END_SCORE_TYPE = "End";
const THIRD_END_SCORE_TYPE = "Third";
const objectiveScoreTypes = [
  SURGE_SCORE_TYPE,
  END_SCORE_TYPE,
  THIRD_END_SCORE_TYPE,
];

function compareObjectivesByScoreType(scoreTypeOne, scoreTypeTwo) {
  return (
    objectiveScoreTypes.indexOf(scoreTypeOne) -
    objectiveScoreTypes.indexOf(scoreTypeTwo)
  );
}

export const CHAMPIONSHIP_FORMAT = "championship";
export const OPEN_FORMAT = "open";
export const RELIC_FORMAT = "relic";
export const NEMESIS_FORMAT = "nemesis";
export const RIVALS_FORMAT = "rivals";

export const ACTIVE_FORMATS = [RIVALS_FORMAT, NEMESIS_FORMAT] as const;

function getAllSetsValidForFormat(format: (typeof ACTIVE_FORMATS)[number]) {
  switch (format) {
    case NEMESIS_FORMAT:
      return Object.values(sets);
    default:
      return Object.values(sets);
  }
}

export const warbandsValidForOrganisedPlay = [
  // very reasonable in 2nd edition
  factions["u"],
  // emberwatch
  factions["tew"],
  factions["ztt"],
  factions["gg"],
  factions["ji"],
  factions["bbg"],
  factions["koc"],
  factions["kab"],
  // released via digital download files
  factions["tf"],
  factions["ss"],
  factions["tsk"],
  factions["dsl"],
  factions["ic"],
  factions["ttd"],
  factions["zgb"],
  factions["bob"],
  factions["sg"],
  factions["mm"],
  factions["cr"],
  factions["toftbq"],
  factions["zg"],
  // grand alliance order
  factions["hh"],
  factions["mp"],
  factions["tp"],
  factions["yg"],
  // grand alliance chaos
  factions["kr"],
  factions["ep"],
  factions["tdp"],
  factions["god"],
  // grand alliance death
  factions["thc"],
  factions["tcc"],
  factions["kar"],
  factions["tg"],
  // grand alliance destruction
  factions["gl"],
  factions["bb"],
  factions["dkk"],
  factions["mk"],
];

function validateCardForPlayFormat(
  card: Card | string,
  format = NEMESIS_FORMAT,
) {
  let c = undefined;
  if (typeof card === "string") {
    c = cards[card as keyof typeof cards];
  } else {
    c = card;
  }

  const [mask] = c.status.split("_");
  switch (format) {
    case NEMESIS_FORMAT:
      return [
        // V-- means card is valid, is Forsaken, is Restricted
        mask[0] === "V",
        mask[1] !== "-",
        mask[2] !== "-",
      ];
    case RIVALS_FORMAT:
      return [true, false, false];
    default:
      return [true, false, false]; // open format
  }
}

const setsWithPlotCards: SetId[] = [
  sets["RG"].id,
  sets["EK"].id,
  sets["CC"].id,
  sets["RS"].id,
] as const;

export const checkDeckHasPlots = (deckSets: SetId[]): Set[] => {
  return deckSets
    .filter((setId) => setsWithPlotCards.includes(setId))
    .map((setId) => sets[setId]);
};

const NEMESIS_MAX_RESTRICTED_CARDS = 1;
const MIN_OBJECTIVE_COUNT = 12;
const MAX_SURGE_OBJECTIVE_COUNT = 6;
const MIN_POWER_CARD_COUNT = 20;

function validateDeckForPlayFormat(
  {
    objectives,
    gambits,
    upgrades,
  }: { objectives: Card[]; gambits: Card[]; upgrades: Card[] },
  format: (typeof ACTIVE_FORMATS)[number],
): [boolean, string[]] {
  const deck: Card[] = [...objectives, ...gambits, ...upgrades];
  const issues: string[] = [];
  const uniqueSets = new Set(deck.map((c) => c.setId));
  const { restricted, forsaken } = deck.reduce(
    (total, card) => {
      const [, forsaken, restricted] = validateCardForPlayFormat(card, format);

      return {
        restricted: total.restricted + (restricted ? 1 : 0),
        forsaken: total.forsaken + (forsaken ? 1 : 0),
      };
    },
    { restricted: 0, forsaken: 0 },
  );

  if (format === RIVALS_FORMAT) {
    if (uniqueSets.size > 1) {
      issues.push(
        "In Rivals format deck can only include cards from the same Rivals deck",
      );
    }

    if (deck.length !== RIVALS_DECK_CARDS_TOTAL) {
      issues.push(
        `Rivals deck must include all ${RIVALS_DECK_CARDS_TOTAL} cards with the same rivals decks symbol.`,
      );
    }

    return [issues.length === 0, issues];
  }

  if (format === NEMESIS_FORMAT) {
    if (deck.length < RIVALS_DECK_CARDS_TOTAL) {
      issues.push(
        `Nemesis deck must have at least ${RIVALS_DECK_CARDS_TOTAL} cards.`,
      );
    }

    if (uniqueSets.size > 2) {
      issues.push(
        "Nemesis deck can only include cards from up to 2 different Rivals decks.",
      );
    }

    if (objectives.length < MIN_OBJECTIVE_COUNT) {
      issues.push(
        `Nemesis deck must have at least ${MIN_OBJECTIVE_COUNT} objective cards.`,
      );
    }

    if (gambits.length + upgrades.length < MIN_POWER_CARD_COUNT) {
      issues.push(
        `Nemesis deck must have at least ${MIN_POWER_CARD_COUNT} power cards (ploys and upgrades).`,
      );
    }

    if (gambits.length > upgrades.length) {
      issues.push("Nemesis deck cannot have more gambits than upgrade cards.");
    }

    if (forsaken > 0) {
      issues.push(
        `Nemesis deck cannot include Forsaken cards. You have ${forsaken} Forsaken cards.`,
      );
    }

    if (restricted > NEMESIS_MAX_RESTRICTED_CARDS) {
      issues.push(
        `Nemesis deck cannot have more than ${NEMESIS_MAX_RESTRICTED_CARDS} restricted cards. You have ${restricted} restricted cards.`,
      );
    }

    if (
      objectives.filter(({ scoreType }) => scoreType === SURGE_SCORE_TYPE)
        .length > MAX_SURGE_OBJECTIVE_COUNT
    ) {
      issues.push(
        `Nemesis deck cannot have more than ${MAX_SURGE_OBJECTIVE_COUNT} Surge objectives. You have ${objectives.filter(({ scoreType }) => scoreType === SURGE_SCORE_TYPE).length} Surge objectives.`,
      );
    }

    const uniqueCardsByName = new Set(deck.map(({ name }) => name));
    if (uniqueCardsByName.size < deck.length) {
      issues.push("Nemesis deck cannot have more than one card with the same name.");
    }

    return [issues.length === 0, issues];
  }

  return [true, issues];
}

function validateObjectivesListForPlayFormat(objectives, format) {
  const issues = [];
  let isValid = true;

  if (format !== OPEN_FORMAT) {
    if (objectives.length != 12) {
      isValid = false;
      issues.push("Deck must have 12 objective cards");
    }

    if (
      objectives.filter((card) => card.scoreType == SURGE_SCORE_TYPE).length > 6
    ) {
      isValid = false;
      issues.push("Deck cannot have more than 6 Surge cards");
    }
  }

  return [isValid, issues];
}

function validatePowerDeckForFormat(gambits, upgrades, format) {
  const issues = [];
  let isValid = true;

  if (format !== OPEN_FORMAT) {
    if (gambits.length + upgrades.length < 20) {
      isValid = false;
      issues.push(
        "Deck must have at least 20 power cards (gambits and upgrades)",
      );
    }

    if (gambits.length > upgrades.length) {
      isValid = false;
      issues.push("Deck cannot have more gambits than upgrade cards.");
    }
  }

  return [isValid, issues];
}

export {
  cardTypes,
  checkCardIsObjective,
  checkCardIsPloy,
  checkCardIsUpgrade,
  compareObjectivesByScoreType,
  getAllSetsValidForFormat,
  getCardById,
  getCardNumberFromId,
  getFactionByAbbr,
  getFactionById,
  getFactionByName,
  getSetById,
  getSetNameById,
  validateCardForPlayFormat,
  validateDeckForPlayFormat,
  validateObjectivesListForPlayFormat,
  validatePowerDeckForFormat,
  factionMembers,
  cards as wucards,
  factions as wufactions,
  sets as wusets,
};

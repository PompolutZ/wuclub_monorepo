import { sortByIdAsc } from "../../utils/sort";
import { factions } from "./factions";
import { sets } from "./sets";
import { cards } from "./cards";
import { factionMembers } from "./factionMembers";
import { format } from "path";
import { Card } from "./types";

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

function getFactionByName(factionName) {
  return Object.values(factions).find((f) => f.name == factionName);
}

function getFactionByAbbr(factionAbbr) {
  return Object.values(factions).find((f) => f.abbr == factionAbbr);
}

function getFactionById() {
  return factions["u"];
}

export type SetId = typeof sets[keyof typeof sets]["id"];
type SetName = typeof sets[keyof typeof sets]["name"];
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
]
export const setHasPlot = (setId: SetId) => {
  return setsWithPlot.includes(setId);
}

function getSetById(setId: SetId) {
  return sets[setId];
}

const cardTypes = ["Objective", "Ploy", "Upgrade", "Spell"];

// This is very stupid but best idea at 22:17 for backward compatibility
function getCardById(cardId) {
  return cards[cardId];
}

function checkCardIsObjective({ type }) {
  return typeof type == "string" ? cardTypes.indexOf(type) == 0 : type === 0;
}

function checkCardIsPloy({ type }) {
  return typeof type == "string"
    ? cardTypes.indexOf(type) == 1 || cardTypes.indexOf(type) == 3
    : type === 1 || type === 3;
}

function checkCardIsUpgrade({ type }) {
  return typeof type == "string" ? cardTypes.indexOf(type) == 2 : type === 2;
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
export const VANGUARD_FORMAT = "vanguard";
export const NEMESIS_FORMAT = "nemesis";
export const RIVALS_FORMAT = "rivals";

export const ACTIVE_FORMATS = [
  RIVALS_FORMAT,
  NEMESIS_FORMAT,
] as const;

function getAllSetsValidForFormat(format: typeof ACTIVE_FORMATS[number]) {
  switch (format) {
    // case CHAMPIONSHIP_FORMAT:
    //   return Object.values(sets).filter(
    //     (set) =>
    //       (set.id >= sets["Gnarlwood core set"].id &&
    //         !Object.values(factionsRivalsDecks).includes(set.id)) ||
    //       set.id === sets["Essential Cards Pack"].id,
    //   );
    case NEMESIS_FORMAT:
      return Object.values(sets);
    default:
      return Object.values(sets);
  }
}

export const warbandsValidForOrganisedPlay = [
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
  factions['dkk'],
  factions["mk"]
]

function validateCardForPlayFormat(card: Card | string, format = NEMESIS_FORMAT) {
  let c = undefined;
  if (typeof card === "string") {
    c = cards[card as keyof typeof cards];
  } else {
    c = card;
  }

  console.log("Validating card", c.id, c.name, "for format", format);

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
  }
}

function validateDeckForPlayFormat({ objectives, gambits, upgrades }, format) {
    return [true, []];
    // @TODO: fix this function later
  const deck = [...objectives, ...gambits, ...upgrades];
  const MAX_RESTRICTED_CARDS = 3;
  const MIN_OBJECTIVE_COUNT = 12;
  const MAX_SURGE_OBJECTIVE_COUNT = 6;
  const MIN_POWER_CARD_COUNT = 20;
  const issues = [];
  let isValid = true;

  if (format === OPEN_FORMAT) return [isValid, issues];

  if (format == VANGUARD_FORMAT) {
    const onlyLatestSeason = deck
      .filter((c) => c.factionId < 2)
      .reduce(
        (lastSeasonOnly, c) =>
          lastSeasonOnly && Number(c.id) > latestSeasonStartNumber,
        true,
      );

    isValid = onlyLatestSeason;
    if (!onlyLatestSeason) {
      issues.push(`Vanguard decks can only include cards from last season`);
    }
  }

  if (format == CHAMPIONSHIP_FORMAT) {
    const onlyLastTwoSeasons = deck
      .filter((c) => c.factionId < 2)
      .reduce((lastTwoSeasons, c) => lastTwoSeasons && c.id > 11000, true);
    isValid = onlyLastTwoSeasons;

    if (!onlyLastTwoSeasons) {
      issues.push(`Championship decks cannot include rotated out cards`);
    }

    const totalInvalidCards = deck
      .map((card) => validateCardForPlayFormat(card, format))
      .reduce(
        (total, [, isForsaken, isRestricted]) => {
          return {
            // we can just sum by using coersion here, but mathematically that doesn't make sense
            forsaken: isForsaken ? total.forsaken + 1 : total.forsaken,
            restricted: isRestricted ? total.restricted + 1 : total.restricted,
          };
        },
        { forsaken: 0, restricted: 0 },
      );

    if (totalInvalidCards.forsaken > 0) {
      isValid = false;
      issues.push(
        `Deck built for ${format} cannot include forsaken cards, but has ${totalInvalidCards.forsaken}`,
      );
    }

    if (totalInvalidCards.restricted > MAX_RESTRICTED_CARDS) {
      isValid = false;
      issues.push(
        `Deck built for ${format} can include at most ${MAX_RESTRICTED_CARDS} restricted cards, but has ${totalInvalidCards.restricted}`,
      );
    }
  }

//   if (format == RIVALS_FORMAT) {
//     const [{ factionId, setId }] = deck;
//     const shouldBeFactionOnlyDeck = factionId > 1;
//     const allCardsAreFactionCards = deck.reduce(
//       (onlyFactionCards, c) => onlyFactionCards && c.setId === setId,
//       true,
//     );
//     const allCardsAreSameRivalsDeck = deck.reduce(
//       (sameRilvalsDeck, c) => sameRilvalsDeck && c.setId === setId,
//       nemesis_valid_sets.includes(setId),
//     );

//     isValid = shouldBeFactionOnlyDeck
//       ? allCardsAreFactionCards
//       : allCardsAreSameRivalsDeck;
//     if (!isValid) {
//       issues.push(
//         "Rivals deck only includes cards with that warband symbol or only includes cards from the same universal Rivals Deck",
//       );
//     }
//   }

//   if (format === NEMESIS_FORMAT) {
//     const universalOnly = deck.filter((c) => c.factionId === 1);
//     if (universalOnly.length) {
//       const universalRivalsDeckId = universalOnly[0].setId;
//       isValid = universalOnly.reduce(
//         (sameRivalsDeck, c) =>
//           sameRivalsDeck && c.setId === universalRivalsDeckId,
//         nemesis_valid_sets.includes(universalRivalsDeckId),
//       );

//       if (!isValid) {
//         issues.push(
//           `Nemesis deck could include only cards with warband symbols or taken from the same single universal Rivals deck`,
//         );
//       }
//     }
//   }

  if (objectives.length < MIN_OBJECTIVE_COUNT) {
    isValid = false;
    issues.push("Your deck must include at least 12 objective cards");
  }

  if (
    objectives.filter((card) => card.scoreType == SURGE_SCORE_TYPE).length >
    MAX_SURGE_OBJECTIVE_COUNT
  ) {
    isValid = false;
    issues.push("Your deck can't include more than 6 Surge cards");
  }

  if (gambits.length + upgrades.length < MIN_POWER_CARD_COUNT) {
    isValid = false;
    issues.push(
      "Your deck must include at least 20 power cards (gambits and upgrades)",
    );
  }

  if (gambits.length > upgrades.length) {
    isValid = false;
    issues.push("Your deck can't include more gambits than upgrade cards");
  }

  const setsWithPlotCards = Object.keys(
    deck.reduce((acc, c) => {
      const wave = Math.floor(c.id / 1000);
      if (wave === 17 || wave === 18) {
        acc[wave] = acc[wave] ? acc[wave] + 1 : 1;
      }

      return acc;
    }, {}),
  ).length;

  if (setsWithPlotCards > 1) {
    isValid = false;
    issues.push(`You can use only one Rivals deck that uses a plot card.`);
  }

  return [isValid, issues];
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

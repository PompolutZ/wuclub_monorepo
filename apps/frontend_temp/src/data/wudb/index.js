import { sortByIdAsc } from "../../utils/sort";
import { factions } from "./factions";
import { sets } from "./sets";
import { cards } from "./cards";
import { factionMembers } from "./factionMembers";

export const latestSeasonStartNumber = 15000;

export const sortedFactions = Object.values(factions).sort(sortByIdAsc);

export const udbPrefexes = {
  L: 2,
  NM: 14,
  N: 3,
  P: 4,
  DC: 9,
  D: 5,
  B: 6,
  G: 7,
  AM: 12,
  A: 8,
  S: 10,
  E: 11,
  H: 13,
  GP: 15,
  SV: 16,
  DD: 17,
  TC: 18,
  GL: 19,
  FF: 20,
  GA: 21,
  BA: 22,
  DS: 23,
  EP: 24,
  SS: 25,
  TT: 26,
  HC: 27,
  VT: 28,
  SG: 29,
  FS: 30,
  SP: 31,
  PP: 32,
  CR: 33,
  TD: 34,
  BS: 35,
  FO: 36,
  SL: 37,
  MM: 38,
  ZG: 39,
  RR: 40,
  SW: 41,
  BQ: 42,
  ZA: 43,
  MO: 44,
  BB: 45,
  SK: 46,
  HP: 47,
  RB: 48,
};

export const grouppedFactions = () => {
  return [
    {
      title: "Universal (Any warband)",
      factions: [
        factions["Universal"],
        factions["Order"],
        factions["Chaos"],
        factions["Death"],
        factions["Destruction"],
      ],
    },
    {
      title: "Wintermaw",
      factions: sortedFactions.filter(
        (f) => f.id >= factions["Brethren of the Bolt"].id,
      ),
    },
    {
      title: "Deathgorge",
      factions: sortedFactions.filter(
        (f) =>
          f.id >= factions["Cyreni's Razors"].id &&
          f.id <= factions["Zondara's Gravebreakers"].id,
      ),
    },
    {
      title: "Wyrdhollow",
      factions: sortedFactions.filter(
        (f) =>
          f.id >= factions["Domitan's Stormcoven"].id &&
          f.id <= factions["Skabbik's Plaguepack"].id,
      ),
    },
    {
      title: "Gnarlwood",
      factions: sortedFactions.filter(
        (f) =>
          f.id >= factions["Gnarlspirit Pack"].id &&
          f.id <= factions["Gryselle's Arenai"].id,
      ),
    },
    {
      title: "Nethermaze",
      factions: sortedFactions.filter(
        (f) =>
          f.id >= factions["Skittershank's Clawpack"].id &&
          f.id <= factions["Gorechosen of Dromm"].id,
      ),
    },
    {
      title: "Harrowdeep",
      factions: sortedFactions.filter(
        (f) =>
          f.id >= factions["Xandire's Truthseekers"].id &&
          f.id <= factions["The Exiled Dead"].id,
      ),
    },
    {
      title: "Direchasm",
      factions: sortedFactions.filter(
        (f) =>
          f.id >= factions["Myari's Purifiers"].id &&
          f.id <= factions["Elathain's Soulraid"].id,
      ),
    },
    {
      title: "Beastgrave",
      factions: sortedFactions.filter(
        (f) =>
          f.id >= factions["Grashrak's Despoilers"].id &&
          f.id <= factions["Morgok's Krushas"].id,
      ),
    },
    {
      title: "Nightvault",
      factions: sortedFactions.filter(
        (f) =>
          f.id >= factions["Stormsire's Cursebreakers"].id &&
          f.id <= factions["Ylthari's Guardians"].id,
      ),
    },
    {
      title: "Shadespire",
      factions: sortedFactions.filter(
        (f) =>
          f.id >= factions["Garrek's Reavers"].id &&
          f.id <= factions["The Farstriders"].id,
      ),
    },
    {
      title: "Starting set",
      factions: sortedFactions.filter(
        (f) =>
          f.id >= factions["Storm of Celestus"].id &&
          f.id <= factions["Drepur's Wraithcreepers"].id,
      ),
    },
    {
      title: "Dreadfane",
      factions: sortedFactions.filter(
        (f) =>
          f.id >= factions["Ironsoul's Condemners"].id &&
          f.id <= factions["Lady Harrow's Mournflight"].id,
      ),
    },
  ];
};

const warbandsWithPlot = [
  factions["Khagra's Ravagers"].id,
  factions["Hedkrakka's Madmob"].id,
  factions["Ephilim's Pandaemonium"].id,
  factions["The Headsmen's Curse"].id,
  factions["Skabbik's Plaguepack"].id,
  factions["Daggok's Stab-ladz"].id,
  factions["Brethren of the Bolt"].id,
];

const rivalDecksWithPlot = [
  sets["Daring Delvers Rivals Deck"].id,
  sets["Tooth and Claw Rivals Deck"].id,
  sets["Fearsome Fortress Rivals Deck"].id,
  sets["Voidcursed Thralls Rivals Deck"].id,
  sets["Breakneck Slaughter Rivals Deck"].id,
  sets["Rimelocked Relics Rivals Deck"].id,
  sets["Hungering Parasite Rivals Deck"].id,
];

const warbandHasPlot = (warbandId) => warbandsWithPlot.includes(warbandId);
const setHasPlot = (setId) => rivalDecksWithPlot.includes(setId);

const plots = {
  Desecration: {
    keyword: "Desecration",
    connection: "Warband",
    asset: "Desecration",
    id: factions["Khagra's Ravagers"].id,
    name: factions["Khagra's Ravagers"].name,
  },
  Primacy: {
    keyword: "Primacy",
    connection: "Warband",
    asset: "Primacy",
    id: factions["Hedkrakka's Madmob"].id,
    name: factions["Hedkrakka's Madmob"].name,
  },
  Pandaemonium: {
    keyword: "Pandaemonium",
    connection: "Warband",
    asset: "Pandaemonium",
    id: factions["Ephilim's Pandaemonium"].id,
    name: factions["Ephilim's Pandaemonium"].name,
  },
  HeadsmensCurse: {
    keyword: "Headsmens Curse",
    connection: "Warband",
    asset: "TheHeadsmensCurse",
    id: factions["The Headsmen's Curse"].id,
    name: factions["The Headsmen's Curse"].name,
  },
  Plaguepack: {
    keyword: "Plaguepack",
    connection: "Warband",
    asset: "Plaguepack",
    id: factions["Skabbik's Plaguepack"].id,
    name: factions["Skabbik's Plaguepack"].name,
  },
  Explorer: {
    keyword: "Explorer",
    connection: "Set",
    asset: "17000",
    id: sets["Daring Delvers Rivals Deck"].id,
    name: sets["Daring Delvers Rivals Deck"].name,
  },
  Savage: {
    keyword: "Savage",
    connection: "Set",
    asset: "18000",
    id: sets["Tooth and Claw Rivals Deck"].id,
    name: sets["Tooth and Claw Rivals Deck"].name,
  },
  Fortress: {
    keyword: "Fortress",
    connection: "Set",
    asset: "20000",
    id: sets["Fearsome Fortress Rivals Deck"].id,
    name: sets["Fearsome Fortress Rivals Deck"].name,
  },
  Voidcursed: {
    keyword: "Voidcursed",
    connection: "Set",
    asset: "voidcursed",
    id: sets["Voidcursed Thralls Rivals Deck"].id,
    name: sets["Voidcursed Thralls Rivals Deck"].name,
  },
  Impetus: {
    keyword: "Impetus",
    connection: "Set",
    asset: "Impetus",
    id: sets["Breakneck Slaughter Rivals Deck"].id,
    name: sets["Breakneck Slaughter Rivals Deck"].name,
  },
  Schemes: {
    keyword: "Schemes",
    connection: "Warband",
    asset: "25433",
    id: factions["Daggok's Stab-ladz"].id,
    name: factions["Daggok's Stab-ladz"].name,
  },
  Rimelocked: {
    keyword: "Rimelocked",
    connection: "Set",
    asset: "Rimelocked",
    id: sets["Rimelocked Relics Rivals Deck"].id,
    name: sets["Rimelocked Relics Rivals Deck"].name,
  },
  Brethren: {
    keyword: "Brethren of the Bold",
    connection: "Warband",
    asset: "45033",
    id: factions["Brethren of the Bolt"].id,
    name: factions["Brethren of the Bolt"].name,
  },
  Parasite: {
    keyword: "Hungering Parasite",
    connection: "Set",
    id: sets["Hungering Parasite Rivals Deck"].id,
    name: sets["Hungering Parasite Rivals Deck"].name,
    cards: [
      {
        asset: "47033",
      },
      {
        asset: "47034",
      },
    ],
  },
};

function getCardNumberFromId(cardId) {
  if (typeof cardId == "string") {
    return +cardId.slice(-3);
  }

  return cardId % 1000;
}

function getFactionByName(factionName) {
  return Object.values(factions).find((f) => f.name == factionName);
}

function getFactionByAbbr(factionAbbr) {
  return Object.values(factions).find((f) => f.abbr == factionAbbr);
}

function getFactionById(factionId) {
  return Object.values(factions).find((f) => f.id === factionId);
}

const nonWarbandIds = [
  factions.Universal.id,
  factions.Order.id,
  factions.Chaos.id,
  factions.Death.id,
  factions.Destruction.id,
];

function checkNonWarbandSpecificCard(card) {
  return nonWarbandIds.includes(card.factionId);
}

function checkWarbandSpecificCard(card) {
  return !checkNonWarbandSpecificCard(card);
}

const idToSetKey = {};
function getSetNameById(setId) {
  if (idToSetKey[setId]) {
    return sets[idToSetKey[setId]].name;
  }

  const [key, value] = Object.entries(sets).find(
    ([, value]) => value.id == setId,
  );
  idToSetKey[setId] = key;
  return value.name;
}

function getSetById(setId) {
  if (idToSetKey[setId]) {
    return sets[idToSetKey[setId]];
  }

  const [key, value] = Object.entries(sets).find(
    ([, value]) => value.id == setId,
  );
  idToSetKey[setId] = key;
  return value;
}

const cardTypes = ["Objective", "Ploy", "Upgrade", "Spell"];

// This is very stupid but best idea at 22:17 for backward compatibility
function getCardById(cardId) {
  return cards[`${Number(cardId)}`];
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
  CHAMPIONSHIP_FORMAT,
  RELIC_FORMAT,
];

const nemesis_valid_sets = [
  sets["Tooth and Claw Rivals Deck"].id,
  sets["Daring Delvers Rivals Deck"].id,
  sets["Fearsome Fortress Rivals Deck"].id,
  sets["Beastbound Assault Rivals Deck"].id,
  sets["Seismic Shock Rivals Deck"].id,
  sets["Toxic Terrors Rivals Deck"].id,
  sets["Voidcursed Thralls Rivals Deck"].id,
  sets["Paths of Prophecy Rivals Deck"].id,
  sets["Breakneck Slaughter Rivals Deck"].id,
  sets["Force of Frost Rivals Deck"].id,
  sets["Malevolent Masks Rivals Deck"].id,
  sets["Rimelocked Relics Rivals Deck"].id,
  sets["Hungering Parasite Rivals Deck"].id,
  sets["Rimewyrm's Bite Rivals Deck"].id,
];

const factionsRivalsDecks = {
  [`${factions["Sons of Velmorn"].name}`]: sets["Gnarlwood core set"].id,
  [`${factions["Gnarlspirit Pack"].name}`]: sets["Gnarlwood core set"].id,
  [`${factions["Grinkrak's Looncourt"].name}`]:
    sets["Grinkrak's Looncourt Rivals Deck"].id,
  [`${factions["Gryselle's Arenai"].name}`]:
    sets["Gryselle's Arenai Rivals Deck"].id,
  [`${factions["Domitan's Stormcoven"].name}`]:
    sets["Domitan's Stormcoven Rivals Deck"].id,
  [`${factions["Ephilim's Pandaemonium"].name}`]:
    sets["Ephilim's Pandaemonium Rivals Deck"].id,
  [`${factions["Ephilim's Pandaemonium"].name}`]:
    sets["Ephilim's Pandaemonium Rivals Deck"].id,
  [`${factions["The Headsmen's Curse"].name}`]:
    sets["The Headsmen's Curse Rivals Deck"].id,
  [`${factions["Sepulchral Guard"].name}`]:
    sets["Sepulchral Guard Rivals Deck"].id,
  [`${factions["The Farstriders"].name}`]:
    sets["The Farstriders Rivals Deck"].id,
  [`${factions["Skabbik's Plaguepack"].name}`]:
    sets["Skabbik's Plaguepack Rivals Deck"].id,
  [`${factions["Cyreni's Razors"].name}`]:
    sets["Cyreni's Razors Rivals Deck"].id,
  [`${factions["The Thricefold Discord"].name}`]:
    sets["The Thricefold Discord Rivals Deck"].id,
  [`${factions["Daggok's Stab-ladz"].name}`]:
    sets["Daggok's Stab-ladz Rivals Deck"].id,
  [`${factions["Zondara's Gravebreakers"].name}`]:
    sets["Zondara's Gravebreakers Rivals Deck"].id,
  [`${factions["Spiteclaw's Swarm"].name}`]:
    sets["Spiteclaw's Swarm Rivals Deck"].id,
  [`${factions["Zarbag's Gitz"].name}`]: sets["Zarbag's Gitz Rivals Deck"].id,
  [`${factions["Thorns of the Briar Queen"].name}`]:
    sets["Thorns of the Briar Queen Rivals Deck"].id,
  [`${factions["Mollog's Mob"].name}`]: sets["Mollog's Mob Rivals Deck"].id,
  [`${factions["Brethren of the Bolt"].name}`]:
    sets["Brethren of the Bolt Rivals Deck"].id,
  [`${factions["The Skinnerkin"].name}`]: sets["The Skinnerkin Rivals Deck"].id,
};

function getAllSetsValidForFormat(format) {
  switch (format) {
    case CHAMPIONSHIP_FORMAT:
      return Object.values(sets).filter(
        (set) =>
          (set.id >= sets["Gnarlwood core set"].id &&
            !Object.values(factionsRivalsDecks).includes(set.id)) ||
          set.id === sets["Essential Cards Pack"].id,
      );
    case NEMESIS_FORMAT:
      return Object.values(sets).filter((set) =>
        nemesis_valid_sets.includes(set.id),
      );
    default:
      return Object.values(sets);
  }
}

function validateCardForPlayFormat(card, format = CHAMPIONSHIP_FORMAT) {
  if (!format) return [];
  let c = undefined;
  if (typeof card === "string") {
    c = cards[Number(card)];
  } else if (typeof card === "number") {
    c = cards[card];
  } else {
    c = card;
  }

  const [championship, relic] = c.status.split("_");
  switch (format) {
    case CHAMPIONSHIP_FORMAT:
      return [
        // V-- means card is valid, is Forsaken, is Restricted
        championship[0] === "V",
        championship[1] !== "-",
        championship[2] !== "-",
      ];
    case RELIC_FORMAT:
      return [
        // V-- means card is valid, is Forsaken. Relic has no restricted cards
        relic[0] === "V",
        relic[1] !== "-",
        undefined,
      ];
    case NEMESIS_FORMAT:
      return [
        // V-- means card is valid, Open format has no cards restrictions
        relic[0] === "V",
        undefined,
        undefined,
      ];
  }
}

function validateDeckForPlayFormat({ objectives, gambits, upgrades }, format) {
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

    var totalInvalidCards = deck
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

  if (format == RIVALS_FORMAT) {
    const [{ factionId, setId }] = deck;
    const shouldBeFactionOnlyDeck = factionId > 1;
    const allCardsAreFactionCards = deck.reduce(
      (onlyFactionCards, c) => onlyFactionCards && c.setId === setId,
      true,
    );
    const allCardsAreSameRivalsDeck = deck.reduce(
      (sameRilvalsDeck, c) => sameRilvalsDeck && c.setId === setId,
      nemesis_valid_sets.includes(setId),
    );

    isValid = shouldBeFactionOnlyDeck
      ? allCardsAreFactionCards
      : allCardsAreSameRivalsDeck;
    if (!isValid) {
      issues.push(
        "Rivals deck only includes cards with that warband symbol or only includes cards from the same universal Rivals Deck",
      );
    }
  }

  if (format === NEMESIS_FORMAT) {
    const universalOnly = deck.filter((c) => c.factionId === 1);
    if (universalOnly.length) {
      const universalRivalsDeckId = universalOnly[0].setId;
      isValid = universalOnly.reduce(
        (sameRivalsDeck, c) =>
          sameRivalsDeck && c.setId === universalRivalsDeckId,
        nemesis_valid_sets.includes(universalRivalsDeckId),
      );

      if (!isValid) {
        issues.push(
          `Nemesis deck could include only cards with warband symbols or taken from the same single universal Rivals deck`,
        );
      }
    }
  }

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

const checkDeckHasPlots = (faction, sets) => {
  return (
    warbandHasPlot(getFactionByName(faction).id) ||
    sets.some((setId) => setHasPlot(setId))
  );
};

const getBoardsValidForFormat = (format) => {
  switch (format) {
    case CHAMPIONSHIP_FORMAT:
    case RIVALS_FORMAT:
    case NEMESIS_FORMAT:
      return [
        1, 2, 7, 9, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
        40,
      ];
    default:
      return Object.keys(boards).map(Number);
  }
};

export {
  cardTypes,
  checkCardIsObjective,
  checkCardIsPloy,
  checkCardIsUpgrade,
  checkDeckHasPlots,
  checkNonWarbandSpecificCard,
  checkWarbandSpecificCard,
  compareObjectivesByScoreType,
  factionsRivalsDecks,
  getAllSetsValidForFormat,
  getBoardsValidForFormat,
  getCardById,
  getCardNumberFromId,
  getFactionByAbbr,
  getFactionById,
  getFactionByName,
  getSetById,
  getSetNameById,
  plots,
  rivalDecksWithPlot,
  setHasPlot,
  validateCardForPlayFormat,
  validateDeckForPlayFormat,
  validateObjectivesListForPlayFormat,
  validatePowerDeckForFormat,
  warbandHasPlot,
  factionMembers,
  warbandsWithPlot,
  cards as wucards,
  factions as wufactions,
  sets as wusets,
};

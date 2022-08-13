import { setsIndex, rotatedOutSetsIndexes } from "./atoms/sets";

export {
    factions,
    PREFIX_LENGTH,
    factionIdPrefix,
    idPrefixToFaction,
    factionIndexes,
    warbandsWithDefaultSet,
    factionMembers,
    factionIndexesWithDefaultSet,
} from "./atoms/factions";

export {
    setInfos,
    setsReleaseDates,
    setsIndex,
    setsNames,
    rotatedOutSetsIndexes,
} from "./atoms/sets";

export { duplicates } from "./atoms/duplicatesDb";

export {
    getCardsByFactionAndSets,
    getDbIndexByWaveAndCard,
} from "./utils/index";

export const cardType = ["Objective", "Ploy", "Upgrade", "Gambit Spell"];
export const cardTypeIcons = [
    "objective-icon",
    "ploy-icon",
    "upgrade-icon",
    "spell-icon",
];
export const objectiveScoreType = [
    "score-immediately",
    "score-end-phase",
    "score-third-end-phase",
    "score-first-end-phase",
];

export const totalCardsPerWave = {
    1: 437,
    2: 60,
    3: 557,
    4: 60,
    5: 124,
    6: 438,
    7: 32,
    8: 40,
    9: 500,
};

export const CHAMPIONSHIP_FORMAT = "championship";
export const OPEN_FORMAT = "open";
export const RELIC_FORMAT = "relic";

export const deckPlayFormats = [CHAMPIONSHIP_FORMAT, OPEN_FORMAT, RELIC_FORMAT];

export const universalCardsStartNumber = 233;

export const firstUniversalCardPerWave = [0, 1233, 2017, 3291, 4025, 5065];

export const bannedCards = {
    // "03317": 1, // Extreme Flank
    // "04048": 1, // Upper Hand
    // "03340": 1, // Keep Them Guessing
    // "03391": 1, // Aggresive Defence
    "06403": 1, // Hunter's Reflexes
    "06418": 1, // Prescient Blow (Beastgrave #418)
};

export const championshipForsakenCards = {
    // "03317": 1, // Extreme Flank
    // "04048": 1, // Upper Hand
    // "03340": 1, // Keep Them Guessing
    // "03391": 1, // Aggresive Defence
    "06403": 1, // Hunter's Reflexes
    "06418": 1, // Prescient Blow (Beastgrave #418)
};

export const championshipRestrictedCards = {
    //Faction Cards
    "06071": 1, // In the Name of the King (Beastgrave #71)
    "06076": 1, // Shifting Madness (Beastgrave #76)

    "06172": 1, // Unexpected Cunning (Beastgrave #172)
    "06191": 1, // Toughened Hide (Beastgrave #191)

    "03004": 1, // Harness the Storm (Nightvault #4)

    "03047": 1, // Sudden Appearance (Nightvault #47)
    "03037": 1, // Treacherous Foe (Nightvault #37)
    "03042": 1, // Howling Vortex (Nightvault #42)

    "05042": 1, // One Will (Champions of Dreadfane #42)
    
    "06251": 1, // Inured to Pain (Beastgrave #251)

    // OBJECTIVE CARDS
    // "03291": 1, // Acolyte of the Katophranes (Nightvault #291)
    // "03305": 1, // Combination Strike (Nightvault #305)
    // "03357": 1, // Opening Gambit (Nightvault #357)
    // "04025": 1, // Burst of Speed (Power Unbound #25)
    // "03302": 1, // Calculated Risk (Nightvault #302)
    // "03343": 1, // Longstrider (Nightvault #343)
    // "03371": 1, // Sorcerous Scouring (Nightvault #371)
    // "04036": 1, // Warning Shot (Power Unbound #36)
    "06299": 1, // Scrum (Beastgrave #299)
    "06308": 1, // Temporary Victory (Beastgrave #308)
    "06282": 1, // Hidden Purpose (Beastgrave #282)

    // POWER CARDS
    // "03436": 1, // Pit Trap (Nightvault #436)
    // "04049": 1, // Blazing Soul (Power Unbound #49)
    // "03451": 1, // Sphere of Aqshy (Nightvault #451)
    // "03539": 1, // Slumbering Key (Nightvault #539)
    // "04057": 1, // Spiritbond (Power Unbound #57)
    // "03543": 1, // Sudden Growth (Nightvault #543)
    // "03550": 1, // Tome of Offerings (Nightvault #550)
    // "03557": 1, // Well of Power (Nightvault #557)
    // "03467": 1, // Transfixing Stare (Nightvault #467)
    // "03551": 1, // Tome of Vitality (Nightvault #351)
    "01349": 1, // Rebound (Shadespire #349)
    "07021": 1, // Rebound (Beastgrave Gift Pack #21)
    "06393": 1, // Cryptic Companion (Beastgrave #393)
    "06341": 1, // Frienzied Search (Beastgrave #341)
    "06359": 1, // Nightmare in the Shadows (Beastgrave #359)
    "06363": 1, // Restless Prize (Beastgrave #363)
    "06431": 1, //Survival Instincts (Beastgrave #431)
    "06434": 1, // Trophy Belt (Beastgrave #434)
    
    "06383": 1, // Amberbone Mace (Beastgrave #383)
    "07013": 1, // Daylight Robbery (Beastgrave  Gitf Pack #315)
    "08029": 1, // Gauntlet of Dominance (Beastgrave: Arena Mortis #29)
    "06362": 1, // Quick Search (Beastgrave #362)
    "06429": 1, // Strength of Terror (Beastgrave #429)
    "08038": 1, // Tight Defence (Beastgrave: Arena Mortis #38)
    "08039": 1, // Vision of Glory (Beastgrave: Arena Mortis #39)
};

export const relicForsakenCards = {
    // OBJECTIVE CARDS
    "03317": 1, // Extreme Flank (Nightvault #317)
    "03340": 1, // Keep Them Guessing (Nightvault #340)
    // POWER CARDS
    "03391": 1, // Aggressive Defence (Nightvault #391)
    "03397": 1, // Baffling Illusion (Nightvault #397)
    "01329": 1, // Great Concussion (Shadespire #329)
    "01336": 1, // Last Chance (Shadespire #336)
    "01347": 1, // Quick Thinker (Shadespire #347)
    "01368": 1, // Time Trap (Shadespire #368)
    "04048": 1, // Upper Hand (Power Unbound #48)
    "06418": 1, // Prescient Blow (Beastgrave #418)
};

export const restrictedCards = {
   //Faction Cards
   "06071": 1, // In the Name of the King (Beastgrave #71)
   "06076": 1, // Shifting Madness (Beastgrave #76)

   "06172": 1, // Unexpected Cunning (Beastgrave #172)
   "06191": 1, // Toughened Hide (Beastgrave #191)

   "03004": 1, // Harness the Storm (Nightvault #4)

   "03047": 1, // Sudden Appearance (Nightvault #47)
   "03037": 1, // Treacherous Foe (Nightvault #37)
   "03042": 1, // Howling Vortex (Nightvault #42)

   "05042": 1, // One Will (Champions of Dreadfane #42)
   
   "06251": 1, // Inured to Pain (Beastgrave #251)

   // OBJECTIVE CARDS
   // "03291": 1, // Acolyte of the Katophranes (Nightvault #291)
   // "03305": 1, // Combination Strike (Nightvault #305)
   // "03357": 1, // Opening Gambit (Nightvault #357)
   // "04025": 1, // Burst of Speed (Power Unbound #25)
   // "03302": 1, // Calculated Risk (Nightvault #302)
   // "03343": 1, // Longstrider (Nightvault #343)
   // "03371": 1, // Sorcerous Scouring (Nightvault #371)
   // "04036": 1, // Warning Shot (Power Unbound #36)
   "06299": 1, // Scrum (Beastgrave #299)
   "06308": 1, // Temporary Victory (Beastgrave #308)
   "06282": 1, // Hidden Purpose (Beastgrave #282)

   // POWER CARDS
   // "03436": 1, // Pit Trap (Nightvault #436)
   // "04049": 1, // Blazing Soul (Power Unbound #49)
   // "03451": 1, // Sphere of Aqshy (Nightvault #451)
   // "03539": 1, // Slumbering Key (Nightvault #539)
   // "04057": 1, // Spiritbond (Power Unbound #57)
   // "03543": 1, // Sudden Growth (Nightvault #543)
   // "03550": 1, // Tome of Offerings (Nightvault #550)
   // "03557": 1, // Well of Power (Nightvault #557)
   // "03467": 1, // Transfixing Stare (Nightvault #467)
   // "03551": 1, // Tome of Vitality (Nightvault #351)
   "01349": 1, // Rebound (Shadespire #349)
   "07021": 1, // Rebound (Beastgrave Gift Pack #21)
   "06393": 1, // Cryptic Companion (Beastgrave #393)
   "06341": 1, // Frienzied Search (Beastgrave #341)
   "06359": 1, // Nightmare in the Shadows (Beastgrave #359)
   "06363": 1, // Restless Prize (Beastgrave #363)
   "06431": 1, //Survival Instincts (Beastgrave #431)
   "06434": 1, // Trophy Belt (Beastgrave #434)
   
   "06383": 1, // Amberbone Mace (Beastgrave #383)
   "07013": 1, // Daylight Robbery (Beastgrave  Gitf Pack #315)
   "08029": 1, // Gauntlet of Dominance (Beastgrave: Arena Mortis #29)
   "06362": 1, // Quick Search (Beastgrave #362)
   "06429": 1, // Strength of Terror (Beastgrave #429)
   "08038": 1, // Tight Defence (Beastgrave: Arena Mortis #38)
   "08039": 1, // Vision of Glory (Beastgrave: Arena Mortis #39)
};
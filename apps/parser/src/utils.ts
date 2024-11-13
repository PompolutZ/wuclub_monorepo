export const getScoreType = (text: string): number => {
    if (text.includes('Score this immediately'))
        return 0;

    if (text.includes('Score this in an end phase'))
        return 1;
        
    if (text.includes('Score this in the third end'))    
        return 2;

    return -1;
}

export enum CardType {
    Objective = 0,
    Ploy = 1,
    Upgrade = 2,
    Spell = 3
}

export const getType = (text: string): number => {
    switch(text) {
        case "Objective": return CardType.Objective;
        case "Ploy": return CardType.Ploy;
        case "Upgrade": return CardType.Upgrade;
        case "Spell": return CardType.Spell;
        default: return -1;
    }
}

export const factionNames = [
    "Universal",
    "Garrek's Reavers", 
    "Steelheart's Champions",
    "Sepulchral Guard",
    "Ironskull's Boyz",
    "The Chosen Axes",
    "Spiteclaw's Swarm",
    "Magore's Fiends",
    "The Farstriders",
    "Stormsire's Cursebreakers",
    "Thorns of the Briar Queen",
    "Eyes of the Nine",
    "Zarbag's Gitz",
    "Godsworn Hunt",
    "Mollog's Mob",
    "Thundrik's Profiteers",
    "Ylthari's Guardians",
    "Ironsoul's Condemners",
    "Lady Harrow's Mournflight",
    "Grashrak's Despoilers",
    "Skaeth's Wild Hunt",
    "The Grymwatch",
    "Rippa's Snarlfangs",
    "Hrothgorn's Mantrappers",
    "The Wurmspat",
    "Morgwaeth's Blade-coven",
    "Morgok's Krushas",
    "Myari's Purifiers",
    "The Dread Pageant",
    "Khagra's Ravagers",
    "The Starblood Stalkers",
    "The Crimson Court",
    "Hedkrakka's Madmob",
    "Kainan's Reapers",
    "Elathain's Soulraid",
    "Storm of Celestus",
    "Drepur's Wraithcreepers",
    "Grand Aliance Order",
    "Grand Aliance Chaos",
    "Grand Aliance Death",
    "Grand Aliance Destruction",
    "Xandire's Truthseekers",
    "Da Kunnin' Krew",
    "Blackpowder's Buccaneers",
    "The Exiled Dead",
    "Skittershank's Clawpack",
    "The Shadeborn",
    "Hexbane's Hunters",
    "Gorechosen of Dromm",
    "Gnarlspirit Pack",
    "Sons of Velmorn",
    "Grinkrak's Looncourt",
    "Gryselle's Arenai",
    "Domitan's Stormcoven",
    "Ephilim's Pandaemonium",
    "The Headsmen's Curse",
    "Skabbik's Plaguepack",
    "Cyreni's Razors",
    "The Thricefold Discord",
    "Daggok's Stab-ladz",
    "Zondara's Gravebreakers",
    "Brethren of the Bolt",
    "The Skinnerkin"
];

type UDBPrefixes = {
    [key: string]: number;
}

const udbPrefexes: UDBPrefixes = {
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
}

type CardData = {
    name: string;
    [key: string]: any; // Add more specific types as needed
}

export const decodeUDB = (card: string): string[] => {
    const match = card.match(/([A-Z]+)?(\d+)?/);
    if (!match) return [];
    
    return [...match, card];
    // return prefix ? udbPrefexes[prefix] * 1000 + Number(cardNumber) : 1000 + Number(cardNumber);
}

export function findDuplicatesByName(name: string, source: Record<string, CardData>): [string, CardData][] {
    return Object.entries(source)
        .filter(([, data]) => data.name === name);        
}

export function dashify(str: string): string {
    return str.replaceAll(" ", "-").replaceAll("'", "").toLowerCase();
} 
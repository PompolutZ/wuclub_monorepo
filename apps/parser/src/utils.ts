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

export const getFaction = (text: string): number => {
    switch (text) {
        case "Universal":
          return 0;
        case "Garrek's Reavers":
          return 1;
        case "Steelheart's Champions":
          return 2;
        case "Sepulchral Guard":
          return 3;
        case "Ironskull's Boyz":
          return 4;
        case "The Chosen Axes":
          return 5;
        case "Spiteclaw's Swarm":
          return 6;
        case "Magore's Fiends":
          return 7;
        case "The Farstriders":
          return 8;
        case "Stormsire's Cursebreakers":
          return 9;
        case "Thorns of the Briar Queen":
          return 10;
        case "Eyes of the Nine":
          return 11;
        case "Zarbag's Gitz":
          return 12;
        case "Godsworn Hunt":
          return 13;
        case "Mollog's Mob":
          return 14;
        case "Thundrik's Profiteers":
          return 15;
        case "Ylthari's Guardians":
          return 16;
        case "Ironsoul's Condemners":
          return 17;
        case "Lady Harrow's Mournflight":
          return 18;
        case "Grashrak's Despoilers":
          return 19;
        case "Skaeth's Wild Hunt":
          return 20;
        case "The Grymwatch":
          return 21;
        case "Rippa's Snarlfangs":
          return 22;
        case "Hrothgorn's Mantrappers":
          return 23;
        case "The Wurmspat":
          return 24;
        case "Morgwaeth's Blade-coven":
          return 25;
        case "Morgok's Krushas":
          return 26;
        case "Myari's Purifiers":
          return 27;
        case "The Dread Pageant":
          return 28;
        case "Khagra's Ravagers":
          return 29;
        case "The Starblood Stalkers":
          return 30;
        case "The Crimson Court":
          return 31;
        case "Hedkrakka's Madmob":
          return 32;
        case "Kainan's Reapers":
          return 33;
        case "Elathain's Soulraid":
          return 34;
        case "Storm of Celestus":
          return 35;
        case "Drepur's Wraithcreepers":
          return 36;
        case "Order":
          return 37;
        case "Chaos":
          return 38;
        case "Death":
          return 39;
        case "Destruction":
          return 40;
        case "Xandire's Truthseekers":
          return 41;
        case "Da Kunnin' Krew":
          return 42;
        case "Blackpowder's Buccaneers":
          return 43;
        case "The Exiled Dead":
          return 44;
        case "Skittershank's Clawpack":
          return 45;
        case "The Shadeborn":
          return 46;
        case "Hexbane's Hunters":
          return 47;
        case "Gorechosen of Dromm":
          return 48;
        case "Gnarlspirit Pack":
          return 49;
        case "Sons of Velmorn":
          return 50;
        case "Grinkrak's Looncourt":
          return 51;
        case "Gryselle's Arenai":
          return 52;
        case "Domitan's Stormcoven":
          return 53;
        case "Ephilim's Pandaemonium":
          return 54;
        case "The Headsmen's Curse":
          return 55;
        case "Skabbik's Plaguepack":
          return 56;
        case "Cyreni's Razors":
          return 57;
        case "The Thricefold Discord":
          return 58;
        case "Daggok's Stab-ladz":
          return 59;
        case "Zondara's Gravebreakers":
          return 60;
        case "Brethren of the Bolt":
          return 61;
        case "The Skinnerkin":
          return 62;
        default:
          return -1;
    }
}
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
export const setsNames: string[] = [
// SHADESPIRE
// "Core set", // 0
// "Sepulchral Guard expansion",
// "Ironskull's Boyz expansion",
// "The Chosen Axes expansion",
// "Spiteclaw's Swarm expansion",
// "Magore's Fiends expansion",
// "The Farstriders expansion",
// "Leaders", // 7

// // NIGHTVAULT

// "Nightvault core set", // 8
// "Eyes of the Nine expansion",
// "Zarbag's Gitz expansion",
// "Garrek's Reavers expansion",
// "Steelheart's Champions expansion",
// "Echoes Of Glory Expansion Card Set", // 13
// "Godsworn Hunt expansion",
// "Mollog's Mob expansion",
// "Thundrik's Profiteers expansion",
// "Ylthari's Guardians expansion",
// "Power Unbound", // 18

// // DREADFANE
// "Dreadfane", // 19

// // BEASTGRAVE
// "Beastgrave core set", // 20
// "The Grymwatch expansion", // 21
// "Rippa's Snarlfangs expansion", // 22
// "The Wurmspat expansion", // 23
// "Hrothgorn's Mantrappers expansion", // 24
// "Morgwaeth's Blade-coven expansion", // 25
// "Morgok's Krushas expansion", // 26
// "Beastgrave Gift Pack expansion", // 27
// "Arena Mortis expansion", // 28

// // DIRECHASM
// "Direchasm core set", // 29
// "Khagra's Ravagers expansion",
// "The Starblood Stalkers expansion", // 30
// "The Crimson Court expansion", // 30
// "Hedkrakka's Madmob expansion", // 32
// "Kainan's Reapers expansion", //
// "Elathain's Soulraid expansion", // 30
// "Starter Set", // 30
// "Essential Cards Pack",
// "Silent Menace Universal Deck",
// "Arena Mortis 2 expansion",

// // Harrowdeep
// "Harrowdeep core set",
// "Blackpowder's Buccaneers expansion",
// "Illusory Might Universal Deck",
// "The Exiled Dead expansion",

// "Nethermaze core set",
// "Hexbane's Hunters expansion",
// "Gorechosen of Dromm expansion",
// "Deadly Depths Rivals Deck",

// "Gnarlwood core set",
// "Daring Delvers Rivals Deck",
// "Tooth and Claw Rivals Deck",
// "Grinkrak's Looncourt expansion",
// "Fearsome Fortress Rivals Deck",
// "Gryselle's Arenai expansion",
// "Beastbound Assault Rivals Deck",

// "Domitan's Stormcoven Rivals Deck",
// "Ephilim's Pandaemonium Rivals Deck",
// "Seismic Shock Rivals Deck",
// "Toxic Terrors Rivals Deck",
// "The Headsmen's Curse Rivals Deck",
// "Voidcursed Thralls Rivals Deck",
// "Sepulchral Guard Rivals Deck",
// "The Farstriders Rivals Deck",
// "Skabbik's Plaguepack Rivals Deck",
// "Paths of Prophecy Rivals Deck",
// "Cyreni's Razors Rivals Deck",
// "The Thricefold Discord Rivals Deck",
// "Breakneck Slaughter Rivals Deck",
// "Force of Frost Rivals Deck",
// "Daggok's Stab-ladz Rivals Deck",
// "Malevolent Masks Rivals Deck",
// "Zondara's Gravebreakers Rivals Deck",
// "Rimelocked Relics Rivals Deck",
// "Spiteclaw's Swarm Rivals Deck",
// "Thorns of the Briar Queen Rivals Deck",
// "Zarbag's Gitz Rivals Deck",
// "Mollog's Mob Rivals Deck",
// "Brethren of the Bolt Rivals Deck",
// "The Skinnerkin Rivals Deck",
// "Hungering Parasite Rivals Deck",
"Blazing Assault Rivals Deck",
"Emberstone Sentinels Rivals Deck",
"Pillage and Plunder Rivals Deck",
"Countdown to Cataclysm Rivals Deck"
];

type GrandAllianceId = 38 | 39 | 40 | 41;

export const factionToGrandAlianceId: Record<string, GrandAllianceId> = {
  "garreks-reavers": 39,
  "steelhearts-champions": 38,
  "sepulchral-guard": 40,
  "ironskulls-boyz": 41,
  "the-chosen-axes": 38,
  "spiteclaws-swarm": 39,
  "magores-fiends": 39,
  "the-farstriders": 38,

  // NIGHTVAULT

  "stormsires-cursebreakers": 38,
  "thorns-of-the-briar-queen": 40,
  "the-eyes-of-the-nine": 39,
  "zarbags-gitz": 41,
  "godsworn-hunt": 39,
  "mollogs-mob": 41,
  "thundriks-profiteers": 38,
  "yltharis-guardians": 38,

  // DREADFANE

  "ironsouls-condemners": 38,
  "lady-harrows-mournflight": 40,

  // BEASTGRAVE

  "grashraks-despoilers": 39,
  "skaeths-wild-hunt": 38,
  "the-grymwatch": 40,
  "rippas-snarlfangs": 41,
  "hrothgorns-mantrappers": 41,
  "the-wurmspat": 39,
  "morgwaeths-blade-coven": 38,
  "morgoks-krushas": 41,

  "myaris-purifiers": 38,
  "dread-pageant": 39,
  "khagras-ravagers": 39, // 29
  "the-starblood-stalkers": 38, // 30
  "the-crimson-court": 40, // 30
  "storm-of-celestus": 38, // 30
  "drepurs-wraithcreepers": 40, // 30
  "hedkrakkas-madmob": 41, // 32
  "kainans-reapers": 40, //
  "elathains-soulreapers": 38,

  "xandires-truthseekers": 38,
  "da-kunnin-krew": 41,
  "blackpowders-buccaneers": 41,
  "the-exiled-dead": 40,
  "skittershanks-clawpack": 39,
  "the-shadeborn": 38,
  "hexbanes-hunters": 38,
  "gorechosen-of-dromm": 39,
  "gnarlspirit-pack": 39,
  "sons-of-velmorn": 40,
  "grinkraks-looncourt": 41,
  "gryselles-arenai": 38,

  "domitans-stormcoven": 38,
  "ephilims-pandaemonium": 39,
  "the-headsmens-curse": 40,
  "skabbiks-plaguepack": 39,

  "cyrenis-razors": 38,
  "the-thricefold-discord": 39,
  "daggoks-stab-ladz": 41,
  "zondaras-gravebreakers": 40,

  "brethren-of-the-bolt": 38,
  "the-skinnerkin": 40,
};

export const factionIndexes: string[] = [
  "universal",
  "garreks-reavers",
  "steelhearts-champions",
  "sepulchral-guard",
  "ironskulls-boyz",
  "the-chosen-axes",
  "spiteclaws-swarm",
  "magores-fiends",
  "the-farstriders", // 8

  // NIGHTVAULT

  "stormsires-cursebreakers", // 9
  "thorns-of-the-briar-queen", // 10
  "the-eyes-of-the-nine", // 11
  "zarbags-gitz", // 12
  "godsworn-hunt", // 13
  "mollogs-mob", // 14
  "thundriks-profiteers", // 15
  "yltharis-guardians", // 16

  // DREADFANE

  "ironsouls-condemners", // 17
  "lady-harrows-mournflight", // 18

  // BEASTGRAVE

  "grashraks-despoilers", // 19
  "skaeths-wild-hunt", // 20
  "the-grymwatch", // 21
  "rippas-snarlfangs", // 22
  "hrothgorns-mantrappers", // 23
  "the-wurmspat", // 24
  "morgwaeths-blade-coven", // 25
  "morgoks-krushas", // 26

  "myaris-purifiers", // 27
  "dread-pageant", // 28
  "khagras-ravagers", // 29
  "the-starblood-stalkers", // 30
  "the-crimson-court", // 31
  "hedkrakkas-madmob", // 32
  "kainans-reapers", //
  "elathains-soulreapers", // 30
  "storm-of-celestus", // 30
  "drepurs-wraithcreepers", // 30

  "grand-aliance-order",
  "grand-aliance-chaos",
  "grand-aliance-death",
  "grand-aliance-destruction",
  "xandires-truthseekers",
  "da-kunnin-krew",
  "blackpowders-buccaneers",
  "the-exiled-dead",
  "skittershanks-clawpack",
  "the-shadeborn",
  "hexbanes-hunters",
  "gorechosen-of-dromm",
  "gnarlspirit-pack",
  "sons-of-velmorn",
  "grinkraks-looncourt",
  "gryselles-arenai",

  "domitans-stormcoven",
  "ephilims-pandaemonium",
  "the-headsmens-curse",
  "skabbiks-plaguepack",
  "cyrenis-razors",
  "the-thricefold-discord",
  "daggoks-stab-ladz",
  "zondaras-gravebreakers",
  "brethren-of-the-bolt",
  "the-skinnerkin",
];

export const factionIdPrefix: Record<string, string> = {
  universal: "u",
  "garreks-reavers": "gr",
  "steelhearts-champions": "sc",
  "sepulchral-guard": "sg",
  "ironskulls-boyz": "ib",
  "the-chosen-axes": "tca",
  "spiteclaws-swarm": "ss",
  "magores-fiends": "mf",
  "the-farstriders": "tf",

  // NIGHTVAULT

  "stormsires-cursebreakers": "stc",
  "thorns-of-the-briar-queen": "toftbq",
  "eyes-of-the-nine": "eotn",
  "zarbags-gitz": "zg",
  "godsworn-hunt": "gh",
  "mollogs-mob": "mm",
  "thundriks-profiteers": "tp",
  "yltharis-guardians": "yg",

  // DREADFANE

  "ironsouls-condemners": "ic",
  "lady-harrows-mournflight": "lhm",

  // BEASTGRAVE

  "grashraks-despoilers": "gd",
  "skaeths-wild-hunt": "swh",
  "the-grymwatch": "tg",
  "rippas-snarlfangs": "rs",
  "hrothgorns-mantrappers": "hm",
  "the-wurmspat": "tw",
  "morgwaeths-blade-coven": "mbc",
  "morgoks-krushas": "mk",

  "myaris-purifiers": "mp",
  "the-dread-pageant": "tdp",
  "khagras-ravagers": "kr", // 29
  "the-starblood-stalkers": "tss", // 30
  "the-crimson-court": "tcc", // 30
  "storm-of-celestus": "soc", // 30
  "drepurs-wraithcreepers": "dw", // 30
  "hedkrakkas-madmob": "hem", // 32
  "kainans-reapers": "kar", //
  "elathains-soulraid": "es",

  "grand-aliance-order": "gao",
  "grand-aliance-chaos": "gac",
  "grand-aliance-death": "gad",
  "grand-aliance-destruction": "gads",
  "xandires-truthseekers": "xt",
  "da-kunnin-krew": "dkk",
  "blackpowders-buccaneers": "bb",
  "the-exiled-dead": "ted",
  "skittershanks-clawpack": "skc",
  "the-shadeborn": "ts",
  "hexbanes-hunters": "hh",
  "gorechosen-of-dromm": "god",
  "gnarlspirit-pack": "gp",
  "sons-of-velmorn": "sov",
  "grinkraks-looncourt": "gl",
  "gryselles-arenai": "ga",

  "domitans-stormcoven": "ds",
  "ephilims-pandaemonium": "ep",
  "the-headsmens-curse": "thc",
  "skabbiks-plaguepack": "sp",
  "cyrenis-razors": "cr",
  "the-thricefold-discord": "ttd",
  "daggoks-stab-ladz": "dsl",
  "zondaras-gravebreakers": "zgb",
  "brethren-of-the-bolt": "bob",
  "the-skinnerkin": "tsk",
}; 
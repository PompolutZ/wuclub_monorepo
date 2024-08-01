import { Format } from "@fxdxpz/schema";

const boards: {
  id: number;
  name: string;
  description: string;
  locations: string[];
}[] = [
  {
    id: 1,
    name: "Mirror Well",
    locations: [
      "Shadespire Core Box",
      "Mirrored City Boards Pack",
      "Starter Set (2023)",
    ],
    description:
      "Found in the Shadespire Core Box, Mirrored City Boards Pack and Starter Set.",
  },
  {
    id: 2,
    name: "Shyishian Stardial",
    locations: [
      "Shadespire Core Box",
      "Mirrored City Boards Pack",
      "Starter Set (2023)",
    ],
    description:
      "Found in the Shadespire Core Box, Mirrored City Boards Pack and Starter Set.",
  },
  {
    id: 3,
    name: "Katophrane's Reliquary",
    locations: ["Shadespire Core Box", "Mirrored City Boards Pack"],
    description:
      "Found in the Shadespire Core Box and Mirrored City Boards Pack.",
  },
  {
    id: 4,
    name: "The Shattered Tower",
    locations: ["Shadespire Core Box", "Mirrored City Boards Pack"],
    description:
      "Found in the Shadespire Core Box and Mirrored City Boards Pack.",
  },
  {
    id: 5,
    name: "Arcane Nexus",
    locations: ["Shattered City Board Pack"],
    description: "Found in the Shattered City Board Pack.",
  },
  {
    id: 6,
    name: "Animus Forge",
    locations: ["Shattered City Board Pack"],
    description: "Found in the Shattered City Board Pack.",
  },
  {
    id: 7,
    name: "Soul Refractor",
    locations: ["Nightvault Core Box", "Starter Set (2023)"],
    description: "Found in the Nightvault Core Box and Starter Set.",
  },
  {
    id: 8,
    name: "Ruptured Seal",
    locations: ["Nightvault Core Box"],
    description: "Found in the Nightvault Core Box.",
  },
  {
    id: 9,
    name: "The Cursed Oubliette",
    locations: ["Nightvault Core Box", "Starter Set (2023)"],
    description: "Found in the Nightvault Core Box and Starter Set.",
  },
  {
    id: 10,
    name: "Penitent's Throne",
    locations: ["Nightvault Core Box"],
    description: "Found in the Nightvault Core Box.",
  },
  {
    id: 11,
    name: "Shattered Refractor",
    locations: ["Forbidden Chambers Board Pack"],
    description: "Found in the Forbidden Chambers Board Pack.",
  },
  {
    id: 12,
    name: "Molten Shardpit",
    locations: ["Forbidden Chambers Board Pack"],
    description: "Found in the Forbidden Chambers Board Pack.",
  },
  {
    id: 13,
    name: "Abandoned Lair",
    locations: ["Beastgrave Core Box"],
    description: "Found in the Beastgrave Core Box.",
  },
  {
    id: 14,
    name: "Living Rock",
    locations: ["Beastgrave Core Box"],
    description: "Found in the Beastgrave Core Box.",
  },
  {
    id: 15,
    name: "Shrine of the Silent People",
    locations: ["Beastgrave Core Box"],
    description: "Found in the Beastgrave Core Box.",
  },
  {
    id: 16,
    name: "Wyrmgrave",
    locations: ["Beastgrave Core Box"],
    description: "Found in the Beastgrave Core Box.",
  },
  {
    id: 17,
    name: "Shade-Cursed Lair",
    locations: ["Arena Mortis Expansion"],
    description: "Found in the Arena Mortis expansion.",
  },
  {
    id: 18,
    name: "Ravaged Hall",
    locations: ["Arena Mortis Expansion"],
    description: "Found in the Arena Mortis expansion.",
  },
  {
    id: 19,
    name: "Hive of Sacrifice",
    locations: ["Direchasm Core Box"],
    description: "Found in the Direchasm Core Box.",
  },
  {
    id: 20,
    name: "Ambertrap Nest",
    locations: ["Direchasm Core Box"],
    description: "Found in the Direchasm Core Box.",
  },
  {
    id: 21,
    name: "Pool of Fangs",
    locations: ["Direchasm Core Box"],
    description: "Found in the Direchasm Core Box.",
  },
  {
    id: 22,
    name: "Menhirs of Binding",
    locations: ["Direchasm Core Box"],
    description: "Found in the Direchasm Core Box.",
  },
  {
    id: 23,
    name: "Bloodtrap Hive",
    locations: ["Arena Mortis 2 Expansion"],
    description: "Found in the Arena Mortis 2 expansion.",
  },
  {
    id: 24,
    name: "Bonefields",
    locations: ["Arena Mortis 2 Expansion"],
    description: "Found in the Arena Mortis 2 expansion.",
  },
  {
    id: 25,
    name: "Ultimatum Engines",
    locations: ["Harrowdeep Core Box"],
    description: "Found in the Harrowdeep Core Box.",
  },
  {
    id: 26,
    name: "Profane Larder",
    locations: ["Harrowdeep Core Box"],
    description: "Found in the Harrowdeep Core Box.",
  },
  {
    id: 27,
    name: "Hall of Sublimation",
    locations: ["Harrowdeep Core Box"],
    description: "Found in the Harrowdeep Core Box.",
  },
  {
    id: 28,
    name: "Chamber of Genesis",
    locations: ["Harrowdeep Core Box"],
    description: "Found in the Harrowdeep Core Box.",
  },
  {
    id: 29,
    name: "The Inevitable Morass",
    locations: ["Nethermaze Core Box"],
    description: "Found in the Nethermaze Core Box.",
  },
  {
    id: 30,
    name: "The Tortured Coil",
    locations: ["Nethermaze Core Box"],
    description: "Found in the Nethermaze Core Box.",
  },
  {
    id: 31,
    name: "Oblivion's Pillars",
    locations: ["Nethermaze Core Box"],
    description: "Found in the Nethermaze Core Box.",
  },
  {
    id: 32,
    name: "The Abyssal Depths",
    locations: ["Nethermaze Core Box"],
    description: "Found in the Nethermaze Core Box.",
  },
  {
    id: 33,
    name: "Mistmarsh Tangle",
    locations: ["Gnarlwood Core Box"],
    description: "Found in the Gnarlwood Core Box.",
  },
  {
    id: 34,
    name: "Visceral Coil",
    locations: ["Gnarlwood Core Box"],
    description: "Found in the Gnarlwood Core Box.",
  },
  {
    id: 35,
    name: "Stricken Swamp",
    locations: ["Gnarlwood Core Box"],
    description: "Found in the Gnarlwood Core Box.",
  },
  {
    id: 36,
    name: "Moltscape",
    locations: ["Gnarlwood Core Box"],
    description: "Found in the Gnarlwood Core Box.",
  },
  {
    id: 37,
    name: "Fleshwrite Vortex",
    locations: ["Wyrdhollow Core Box"],
    description: "Found in the Wyrdhollow Core Box.",
  },
  {
    id: 38,
    name: "Root-hall Bleed",
    locations: ["Wyrdhollow Core Box"],
    description: "Found in the Wyrdhollow Core Box.",
  },
  {
    id: 39,
    name: "The Seamsplit Folly",
    locations: ["Wyrdhollow Core Box"],
    description: "Found in the Wyrdhollow Core Box.",
  },
  {
    id: 40,
    name: "Tendon Hollows",
    locations: ["Wyrdhollow Core Box"],
    description: "Found in the Wyrdhollow Core Box.",
  },
  {
    id: 41,
    name: "Glacial Tomb",
    locations: ["Deathgorge Core Box"],
    description: "Found in the Deathgorge Core Box.",
  },
  {
    id: 42,
    name: "Frost-wracked Ruins",
    locations: ["Deathgorge Core Box"],
    description: "Found in the Deathgorge Core Box.",
  },
  {
    id: 43,
    name: "The Rimhowl Scouring",
    locations: ["Deathgorge Core Box"],
    description: "Found in the Deathgorge Core Box.",
  },
  {
    id: 44,
    name: "The Iceswirl Maw",
    locations: ["Deathgorge Core Box"],
    description: "Found in the Deathgorge Core Box.",
  },
  {
    id: 45,
    name: "The Glacial Graveyard",
    locations: ["Wintermaw Core Box"],
    description: "Found in the Wintermaw Core Box.",
  },
  {
    id: 46,
    name: "Rimespawn Hatcheries",
    locations: ["Wintermaw Core Box"],
    description: "Found in the Wintermaw Core Box.",
  },
  {
    id: 47,
    name: "The Wyrmburrow",
    locations: ["Wintermaw Core Box"],
    description: "Found in the Wintermaw Core Box.",
  },
  {
    id: 48,
    name: "Icefall Pits",
    locations: ["Wintermaw Core Box"],
    description: "Found in the Wintermaw Core Box.",
  },
];

export type Board = (typeof boards)[number];

const validBoardIds = [
  3, 4, 7, 9, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
];

export const getBoardsValidForFormat = (format: Format): Board[] => {
  switch (format) {
    case "CHAMPIONSHIP":
    case "RIVALS":
    case "NEMESIS":
      return boards.filter(({ id }) => validBoardIds.includes(Number(id)));
    default:
      return boards;
  }
};

export const getBoardValidFormats = (
  id: number
): (Format | "ALL FORMATS")[] => {
  if (validBoardIds.includes(id)) {
    return ["CHAMPIONSHIP", "RIVALS", "NEMESIS"];
  }

  return ["ALL FORMATS"];
};
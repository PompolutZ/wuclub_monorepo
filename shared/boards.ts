import { Format } from "@fxdxpz/schema";

const boards: { id: number; name: string; location: string }[] = [
  {
    id: 1,
    name: "Mirror Well",
    location:
      "Found in the Shadespire Core Box, Mirrored City Boards Pack and Starter Set.",
  },
  {
    id: 2,
    name: "Shyishian Stardial",
    location:
      "Found in the Shadespire Core Box, Mirrored City Boards Pack and Starter Set.",
  },
  {
    id: 3,
    name: "Katophrane's Reliquary",
    location: "Found in the Shadespire Core Box and Mirrored City Boards Pack.",
  },
  {
    id: 4,
    name: "Shattered Tower",
    location: "Found in the Shadespire Core Box and Mirrored City Boards Pack.",
  },
  {
    id: 5,
    name: "Arcane Nexus",
    location: "Found in the Shattered City Board Pack.",
  },
  {
    id: 6,
    name: "Animus Forge",
    location: "Found in the Shattered City Board Pack.",
  },
  {
    id: 7,
    name: "Soul Refractor",
    location: "Found in the Nightvault Core Box and Starter Set.",
  },
  {
    id: 8,
    name: "Ruptured Seal",
    location: "Found in the Nightvault Core Box.",
  },
  {
    id: 9,
    name: "Cursed Oubliette",
    location: "Found in the Nightvault Core Box and Starter Set.",
  },
  {
    id: 10,
    name: "Penitent's Throne",
    location: "Found in the Nightvault Core Box.",
  },
  {
    id: 11,
    name: "Shattered Refractor",
    location: "Found in the Forbidden Chambers Board Pack.",
  },
  {
    id: 12,
    name: "Molten Shardpit",
    location: "Found in the Forbidden Chambers Board Pack.",
  },
  {
    id: 13,
    name: "Abandoned Lair",
    location: "Found in the Beastgrave Core Box.",
  },
  {
    id: 14,
    name: "Living Rock",
    location: "Found in the Beastgrave Core Box.",
  },
  {
    id: 15,
    name: "Shrine of the Silent People",
    location: "Found in the Beastgrave Core Box.",
  },
  { id: 16, name: "Wyrmgrave", location: "Found in the Beastgrave Core Box." },
  {
    id: 17,
    name: "Shade-Cursed Lair",
    location: "Found in the Arena Mortis expansion.",
  },
  {
    id: 18,
    name: "Ravaged Hall",
    location: "Found in the Arena Mortis expansion.",
  },
  {
    id: 19,
    name: "Hive of Sacrifice",
    location: "Found in the Direchasm Core Box.",
  },
  {
    id: 20,
    name: "Ambertrap Nest",
    location: "Found in the Direchasm Core Box.",
  },
  {
    id: 21,
    name: "Pool of Fangs",
    location: "Found in the Direchasm Core Box.",
  },
  {
    id: 22,
    name: "Menhirs of Binding",
    location: "Found in the Direchasm Core Box.",
  },
  {
    id: 23,
    name: "Bloodtrap Hive",
    location: "Found in the Arena Mortis 2 expansion.",
  },
  {
    id: 24,
    name: "Bonefields",
    location: "Found in the Arena Mortis 2 expansion.",
  },
  {
    id: 25,
    name: "Ultimatum Engines",
    location: "Found in the Harrowdeep Core Box.",
  },
  {
    id: 26,
    name: "Profane Larder",
    location: "Found in the Harrowdeep Core Box.",
  },
  {
    id: 27,
    name: "Hall of Sublimation",
    location: "Found in the Harrowdeep Core Box.",
  },
  {
    id: 28,
    name: "Chamber of Genesis",
    location: "Found in the Harrowdeep Core Box.",
  },
  {
    id: 29,
    name: "The Inevitable Morass",
    location: "Found in the Nethermaze Core Box.",
  },
  {
    id: 30,
    name: "The Tortured Coil",
    location: "Found in the Nethermaze Core Box.",
  },
  {
    id: 31,
    name: "Oblivion's Pillars",
    location: "Found in the Nethermaze Core Box.",
  },
  {
    id: 32,
    name: "The Abyssal Depths",
    location: "Found in the Nethermaze Core Box.",
  },
  {
    id: 33,
    name: "Mistmarsh Tangle",
    location: "Found in the Gnarlwood Core Box.",
  },
  {
    id: 34,
    name: "Visceral Coil",
    location: "Found in the Gnarlwood Core Box.",
  },
  {
    id: 35,
    name: "Stricken Swamp",
    location: "Found in the Gnarlwood Core Box.",
  },
  { id: 36, name: "Moltscape", location: "Found in the Gnarlwood Core Box." },
  {
    id: 37,
    name: "Fleshwrite Vortex",
    location: "Found in the Wyrdhollow Core Box.",
  },
  {
    id: 38,
    name: "Root-hall Bleed",
    location: "Found in the Wyrdhollow Core Box.",
  },
  {
    id: 39,
    name: "The Seamsplit Folly",
    location: "Found in the Wyrdhollow Core Box.",
  },
  {
    id: 40,
    name: "Tendon Hollows",
    location: "Found in the Wyrdhollow Core Box.",
  },
  {
    id: 41,
    name: "Glacial Tomb",
    location: "Found in the Deathgorge Core Box.",
  },
  {
    id: 42,
    name: "Frost-wracked Ruins",
    location: "Found in the Deathgorge Core Box.",
  },
  {
    id: 43,
    name: "The Rimhowl Scouring",
    location: "Found in the Deathgorge Core Box.",
  },
  {
    id: 44,
    name: "The Iceswirl Maw",
    location: "Found in the Deathgorge Core Box.",
  },
  {
    id: 45,
    name: "The Glacial Graveyard",
    location: "Found in the Wintermaw Core Box.",
  },
  {
    id: 46,
    name: "Rimespawn Hatcheries",
    location: "Found in the Wintermaw Core Box.",
  },
  {
    id: 47,
    name: "The Wyrmburrow",
    location: "Found in the Wintermaw Core Box.",
  },
  {
    id: 48,
    name: "Icefall Pits",
    location: "Found in the Wintermaw Core Box.",
  },
];

export type Board = (typeof boards)[number];

const validBoardIds = [
  1, 2, 7, 9, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
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

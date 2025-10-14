
export const boards = [
  {
    id: 1,
    name: "The Blazing Bastion",
    asset: "the_blazing_bastion",
    locations: [
      "Embergard Core Box",
    ],
    description:
      "Found in the Embergard Core Box.",
  },
  {
    id: 2,
    name: "Haven of the Hated",
    asset: "haven_of_the_hated",
    locations: [
      "Embergard Core Box",
    ],
    description:
      "Found in the Embergard Core Box.",
  },
    {
    id: 3,
    name: "The Verdant Maw",
    asset: "the_verdant_maw",
    locations: [
      "Spitewood Box",
    ],
    description:
      "Found in the Spitewood Box.",
  },
    {
    id: 4,
    name: "Whispering Root Hollow",
    asset: "whispering_root_hollow",
    locations: [
      "Spitewood Box",
    ],
    description:
      "Found in the Spitewood Box.",
  },
] as const;

export type Board = (typeof boards)[number];


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
] as const;

export type Board = (typeof boards)[number];

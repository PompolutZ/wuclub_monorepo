import { Factions } from "./factions";

export type Plot = {
  keyword: string;
  connection: "Warband" | "Set";
  asset: string;
  id: number;
  name: Factions;
  cards?: { asset: string }[]; // Optional property to handle the special case for "Parasite"
};

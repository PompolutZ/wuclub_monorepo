import type { Card } from "../../../../../../data/wudb";

export type FilterConfig = {
  label: string;
  filter: (card: Card) => boolean;
  icon?: React.ReactNode;
};

export const CARD_TYPE_FILTERS: FilterConfig[] = [
  {
    label: "Objective",
    filter: (card) => card.type === "Objective",
  },
  {
    label: "Gambit",
    filter: (card) => card.type === "Ploy",
  },
  {
    label: "Upgrade",
    filter: (card) => card.type === "Upgrade",
  },
];

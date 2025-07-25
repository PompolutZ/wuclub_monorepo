import { ReactNode } from "react";
import CompassIcon from "@icons/compass.svg?react";
import { checkDeckHasPlots, SetId } from "../../data/wudb";

export interface DeckTitleProps {
  sets: string[];
  children: ReactNode;
}

export const DeckTitle = ({ sets, children }: DeckTitleProps) => (
  <div className="flex space-x-1 items-center">
    {checkDeckHasPlots(sets as SetId[]) && (
      <CompassIcon className="w-4 h-4 stroke-purple-700" />
    )}
    {children}
  </div>
);

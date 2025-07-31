import { ReactNode } from "react";
import CompassIcon from "@icons/compass.svg?react";
import { checkDeckHasPlots } from "../../data/wudb";
import { SetId } from "../../data/wudb/types";

export interface DeckTitleProps {
  sets: string[];
  children: ReactNode;
}

export const DeckTitle = ({ sets, children }: DeckTitleProps) => {
  const setsWithPlots = checkDeckHasPlots(sets as SetId[]);
  return (
    <div>
      {children}
      <div className="flex items-center space-x-1 text-purple-700 text-sm">
        {setsWithPlots.length > 0 && (
          <>
            <CompassIcon className="w-4 h-4 stroke-purple-700" />
            <span>Plots:</span>
            {setsWithPlots.map((set) => (
              <span key={set.id}>
                {set.displayName.replace("Rivals Deck", "")}
              </span>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

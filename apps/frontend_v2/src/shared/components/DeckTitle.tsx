import { ReactNode } from "react";
import CompassIcon from "@icons/compass.svg?react";
import { checkDeckHasPlots, SetId } from "@fxdxpz/wudb";

export interface DeckTitleProps {
  sets: SetId[];
  children: ReactNode;
}

export const DeckTitle = ({ sets, children }: DeckTitleProps) => {
  const setsWithPlots = checkDeckHasPlots(sets);
  return (
    <div>
      {children}
      <div className="flex flex-wrap items-center space-x-1 text-purple-700 text-sm">
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

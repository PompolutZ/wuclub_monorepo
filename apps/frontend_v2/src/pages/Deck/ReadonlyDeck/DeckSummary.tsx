import { memo } from "react";
import SetsList from "../../../atoms/SetsList";
import { FactionDeckPicture } from "@components/FactionDeckPicture";
import { PeopleIcon, PersonIcon } from "../../../shared/components/Icons";
import { DeckTitle } from "@/shared/components/DeckTitle";
import type { DeckSummaryProps } from "./types";

/**
 * Displays deck summary information including faction, name, date, and privacy status
 * Memoized to prevent re-renders when deck metadata hasn't changed
 */
const DeckSummary = memo(function DeckSummary({
  faction,
  name,
  date,
  sets,
  children,
  isPrivate,
}: DeckSummaryProps) {
  return (
    <div className="flex items-center flex-1 space-x-4 min-w-0">
      <FactionDeckPicture size="large" faction={faction} />

      <div className="space-y-2 text-gray-900 min-w-0">
        <div>
          <DeckTitle sets={sets}>
            <h1 className="text-xl truncate">{name}</h1>
          </DeckTitle>

          <h2 className="font-bold text-sm flex items-center space-x-2 divide-x-2 divide-gray-700">
            <div className="text-gray-500 text-xs">{date}</div>
            {isPrivate ? (
              <div className="flex items-center text-gray-500 uppercase text-xs pl-2">
                <PersonIcon className="w-4 h-4 fill-current mr-1" />
                private
              </div>
            ) : (
              <div className="flex items-center text-purple-700 uppercase text-xs pl-2">
                <PeopleIcon className="w-4 h-4 stroke-current mr-1" />
                public
              </div>
            )}
          </h2>
        </div>
        <div className="mt-1 mb-1">{<SetsList sets={sets} />}</div>
        <div>{children}</div>
      </div>
    </div>
  );
});

export default DeckSummary;

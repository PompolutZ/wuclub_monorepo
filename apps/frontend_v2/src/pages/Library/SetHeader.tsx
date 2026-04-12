import CompassIcon from "@icons/compass.svg?react";
import { RivalsDeckIcon } from "../../shared/components/RivalsDeckIcon";

interface SetHeaderProps {
  setId: string;
  setName: string;
  displayName: string;
  count: number;
  hasPlot: boolean;
  onViewPlot: (setId: string) => void;
}

export function SetHeader({
  setId,
  setName,
  displayName,
  count,
  hasPlot,
  onViewPlot,
}: SetHeaderProps) {
  return (
    <div className="flex items-center bg-gray-100 border-b border-gray-300 px-2 py-2">
      <RivalsDeckIcon
        setName={setName}
        setId={setId}
        className="w-8 h-8 mr-2"
      />
      <div className="flex-1 min-w-0">
        <h2 className="text-gray-900 text-base font-medium truncate">
          {displayName}
        </h2>
        {hasPlot && (
          <button
            onClick={() => onViewPlot(setId)}
            className="text-xs text-purple-700 hover:underline flex items-center gap-1"
          >
            <CompassIcon className="w-3 h-3 stroke-purple-700" />
            View plot card
          </button>
        )}
      </div>
      <span className="text-gray-500 text-sm ml-2">{count}</span>
    </div>
  );
}

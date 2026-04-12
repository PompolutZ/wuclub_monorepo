import CompassIcon from "@icons/compass.svg?react";
import { setHasPlot } from "@fxdxpz/wudb";
import type { SetId } from "@fxdxpz/wudb";
import { ExpansionPicture } from "./ExpansionPicture";

interface RivalsDeckIconProps {
  setName: string;
  setId: string;
  className?: string;
}

export function RivalsDeckIcon({
  setName,
  setId,
  className,
}: RivalsDeckIconProps) {
  return (
    <div className="relative shrink-0">
      <ExpansionPicture setName={setName} className={className} />
      {setHasPlot(setId as SetId) && (
        <div className="absolute w-4 h-4 bg-purple-700 -bottom-1 left-1/2 -translate-x-1/2 rounded-full text-white">
          <CompassIcon className="stroke-current w-4 h-4" />
        </div>
      )}
    </div>
  );
}

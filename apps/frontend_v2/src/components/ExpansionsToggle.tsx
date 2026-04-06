import CompassIcon from "@icons/compass.svg?react";
import ReactTooltip from "react-tooltip";
import { setHasPlot } from "@fxdxpz/wudb";
import type { Set, SetId } from "@fxdxpz/wudb";
import { ToggableExpansionIcon } from "@/shared/components/ToggableExpansionIcon";

interface ExpansionsToggleProps {
  expansions?: Set[];
  selectedExpansions?: Set[];
  onExpansionsChange: (expansions: Set[]) => void;
  singleSet?: boolean;
}

function ExpansionsToggle({
  expansions = [],
  selectedExpansions = [],
  onExpansionsChange,
  singleSet,
}: ExpansionsToggleProps) {
  const handleToggle = (expansion: Set) => () => {
    if (singleSet) {
      onExpansionsChange([expansion]);
    } else {
      const next = selectedExpansions.includes(expansion)
        ? selectedExpansions.filter((e) => e != expansion)
        : [...selectedExpansions, expansion];

      onExpansionsChange(next);
    }
  };

  return (
    <>
      <div className="flex flex-wrap space-x-1">
        {expansions.map((expansion) => (
          <div
            key={expansion.id}
            data-tip={expansion.displayName}
            className="relative"
          >
            <ToggableExpansionIcon
              set={expansion.name}
              isEnabled={selectedExpansions.includes(expansion)}
              onClick={handleToggle(expansion)}
            />
            {setHasPlot(expansion.id as SetId) && (
              <div className="absolute w-4 h-4 bg-purple-700 -bottom-1 left-4 rounded-full text-white">
                <CompassIcon className="stroke-current w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>
      <ReactTooltip effect="solid" />
    </>
  );
}

export default ExpansionsToggle;

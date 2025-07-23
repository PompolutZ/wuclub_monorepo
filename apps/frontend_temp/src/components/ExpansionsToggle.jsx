import CompassIcon from "@icons/compass.svg?react";
import ReactTooltip from "react-tooltip";
import { ToggableExpansionIcon } from "../atoms/ToggableExpansionIcon";
import { setHasPlot } from "../data/wudb";

function ExpansionsToggle({
    expansions = [],
    selectedExpansions = [],
    onExpansionsChange,
    singleSet,
}) {
    const handleToggle = (expansion) => () => {
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
                            variant="large"
                            isEnabled={selectedExpansions.includes(expansion)}
                            onClick={handleToggle(expansion)}
                        />
                        {setHasPlot(expansion.id) && (
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

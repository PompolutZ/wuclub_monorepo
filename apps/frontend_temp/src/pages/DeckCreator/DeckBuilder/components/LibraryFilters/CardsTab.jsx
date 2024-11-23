import React, { useMemo } from "react";
import LockIcon from "@icons/lock.svg?react";
import SurgeIcon from "@icons/zap.svg?react";
import FilterIcon from "@icons/filter.svg?react";
import {
    validateCardForPlayFormat,
    CHAMPIONSHIP_FORMAT,
} from "../../../../../data/wudb";
import ToggleButton from "../ToggleButton";
import { useDeckBuilderState } from "../../..";
import IconButton from "../../../../../shared/components/IconButton";

function CardsTab({
    enabledTypes,
    totalActiveFilters,
    onToggleType,
    onToggleShowFilters,
}) {
    const {
        selectedObjectives,
        selectedGambits,
        selectedUpgrades,
        format,
    } = useDeckBuilderState();

    const restrictedCards = useMemo(() => {
        return [
            ...selectedObjectives,
            ...selectedUpgrades,
            ...selectedGambits,
        ].filter((card) => {
            const [, , isRestricted] = validateCardForPlayFormat(card, format);
            return isRestricted;
        });
    }, [selectedObjectives, selectedUpgrades, selectedGambits, format]);

    const surgeCount = useMemo(() => {
        return selectedObjectives.filter(
            (objective) =>
                objective.scoreType === "Surge" || objective.scoreType === 0
        ).length;
    }, [selectedObjectives]);

    return (
        <div className="flex items-center my-2">
            {format === CHAMPIONSHIP_FORMAT && (
                <div className="flex flex-col items-center mx-4">
                    <LockIcon className="text-yellow-600 stroke-current w-4 h-4" />
                    <h6 className="text-gray-700 text-xs">
                        {restrictedCards.length}/3
                    </h6>
                </div>
            )}
            <ToggleButton
                className="flex-1"
                isOn={enabledTypes.includes("Objective")}
                onClick={onToggleType("Objective")}
            >
                <div className="flex items-center space-x-1">
                    <img
                        src={`/assets/icons/objective-icon.png`}
                        alt="objective"
                        className="w-4 h-4"
                    />
                    <div>{selectedObjectives.length}</div>
                    <SurgeIcon
                        className={`stroke-current w-3 h-3 flex-shrink-0 ${
                            surgeCount > 6 ? "text-red-700" : "text-gray-700"
                        }`}
                    />
                    <h6
                        className={`ml-1 text-xs ${
                            surgeCount > 6 ? "text-red-700" : "text-gray-700"
                        }`}
                    >
                        {surgeCount}/6
                    </h6>
                </div>
            </ToggleButton>
            <ToggleButton
                className="flex-1 flex items-center space-x-1"
                isOn={enabledTypes.includes("Gambit")}
                onClick={onToggleType("Gambit")}
            >
                <img
                    src={`/assets/icons/spell-icon.png`}
                    alt="ploy"
                    className="w-4 h-4"
                />
                <img
                    src={`/assets/icons/ploy-icon.png`}
                    alt="spell"
                    className="w-4 h-4"
                />
                <div>{selectedGambits.length}</div>
            </ToggleButton>
            <ToggleButton
                className="flex-1 flex items-center space-x-1 border-r-2"
                isOn={enabledTypes.includes("Upgrade")}
                onClick={onToggleType("Upgrade")}
            >
                <img
                    src={`/assets/icons/upgrade-icon.png`}
                    alt="upgrade"
                    className="w-4 h-4"
                />
                <div>{selectedUpgrades.length}</div>
            </ToggleButton>
            <IconButton
                className="rounded-full ml-3 px-2 w-11 h-11 grid place-content-center relative hover:bg-gray-100 focus:text-purple-700 "
                onClick={onToggleShowFilters}
            >
                <FilterIcon className="w-6 h-6 stroke-current filter drop-shadow-md" />
                {totalActiveFilters > 0 && (
                    <div className="absolute top-0 right-0 grid place-content-center w-5 h-5 rounded-full border-white border bg-purple-500 text-white text-xs">
                        {totalActiveFilters}
                    </div>
                )}
            </IconButton>
        </div>
    );
}

export default CardsTab;

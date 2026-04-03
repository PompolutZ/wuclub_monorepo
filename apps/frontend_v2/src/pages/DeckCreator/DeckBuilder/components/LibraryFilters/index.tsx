import React, { useEffect, useState } from "react";
import CardsTab from "./CardsTab";
import { animated, useSpring } from "@react-spring/web";
import { OBJECTIVE_GLORY_FILTERS } from "./constants/objectiveGloryFilters";
import { OBJECTIVE_SCORE_TYPE_FILTERS } from "./constants/objectiveScoreTypeFilters";
import { CARD_TYPE_FILTERS } from "./constants/cardTypeFilters";
import type { FilterConfig } from "./constants/cardTypeFilters";
import FiltersGroupToggles from "./FilterGroupToggles";
import useMeasure from "react-use-measure";
import type { Card } from "../../../../../data/wudb";
import type { CardFilter } from "../../../reducer";

type FilterFn = (card: Card) => boolean;

interface LibraryFiltersProps {
  bounds: { height: number; width: number };
  onFiltersChanged: (filter: CardFilter) => void;
}

const composeTypeFilters = (enabledTypes: string[]): FilterFn => {
  if (enabledTypes.length === 0) {
    return () => false;
  }
  return composeFilters(enabledTypes, CARD_TYPE_FILTERS);
};

const composeFilters = (
  enabledTypes: string[],
  allTypeFilters: FilterConfig[],
): FilterFn => {
  if (enabledTypes.length === 0) {
    return (card) => !!card;
  }

  return enabledTypes
    .map((type) => {
      const filter = allTypeFilters.find((f) => f.label === type);
      if (!filter) throw Error("Cannot find filter matching type!");
      return filter.filter;
    })
    .reduce<FilterFn>(
      (compFilter, fun) => {
        return compFilter
          ? (card) => compFilter(card) || fun(card)
          : (card) => fun(card);
      },
      () => false,
    );
};

function LibraryFilters({ bounds, onFiltersChanged }: LibraryFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [enabledCardTypes, setEnabledCardTypes] = useState(
    CARD_TYPE_FILTERS.slice(0, 1).map((f) => f.label),
  );
  const [enabledObjectiveScoreTypes, setObjectiveScoreTypes] = useState<
    string[]
  >([]);
  const [enabledGloryFilters, setEnabledGloryFilters] = useState<string[]>([]);
  const [ref, { height }] = useMeasure();

  const styles = useSpring({
    height: showFilters ? bounds.height : 0,
    width: bounds.width,
    top: height,
    left: 0,
    position: "absolute",
    zIndex: 1,
  });

  const updateAllFilters = () => {
    const typesFilter = composeTypeFilters(enabledCardTypes);
    const gloryFilters = composeFilters(
      enabledGloryFilters,
      OBJECTIVE_GLORY_FILTERS,
    );
    const scoreTypeFilters = composeFilters(
      enabledObjectiveScoreTypes,
      OBJECTIVE_SCORE_TYPE_FILTERS,
    );

    const aggregateFilters = (card: Card) => {
      if (enabledCardTypes.includes("Objective")) {
        return (
          typesFilter(card) && gloryFilters(card) && scoreTypeFilters(card)
        );
      }
      return typesFilter(card);
    };

    onFiltersChanged({ test: (card) => aggregateFilters(card) });
  };

  useEffect(() => {
    updateAllFilters();
  }, [enabledCardTypes, enabledGloryFilters, enabledObjectiveScoreTypes]);

  const changeShowFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const handleToggleSubFilter =
    (value: string[], update: React.Dispatch<React.SetStateAction<string[]>>) =>
    (item: string) =>
    () => {
      const index = value.indexOf(item);
      if (index >= 0) {
        update((prev: string[]) => [
          ...prev.slice(0, index),
          ...prev.slice(index + 1),
        ]);
      } else {
        update((prev: string[]) => [...prev, item]);
      }
    };

  const handleToggleType =
    (
      _selectedTypes: string[],
      _allTypes: string[],
      update: React.Dispatch<React.SetStateAction<string[]>>,
    ) =>
    (type: string) =>
    () => {
      update([type]);
    };

  const handleClearAll = () => {
    setEnabledGloryFilters([]);
    setObjectiveScoreTypes([]);
  };

  const totalActiveFilters = enabledCardTypes.includes("Objective")
    ? enabledObjectiveScoreTypes.length + enabledGloryFilters.length
    : 0;

  return (
    <div className="relative" ref={ref}>
      <CardsTab
        enabledTypes={enabledCardTypes}
        onToggleType={handleToggleType(
          enabledCardTypes,
          CARD_TYPE_FILTERS.map((f) => f.label),
          setEnabledCardTypes,
        )}
        totalActiveFilters={totalActiveFilters}
        onToggleShowFilters={changeShowFilters}
      />
      <animated.div
        className="bg-white text-gray-900 flex"
        style={styles as unknown as React.CSSProperties}
      >
        <div
          className={`${
            showFilters ? "flex-1 flex flex-col overflow-y-auto" : "hidden"
          } p-2`}
        >
          <FiltersGroupToggles
            title="Glory"
            disabled={!enabledCardTypes.includes("Objective")}
            filters={OBJECTIVE_GLORY_FILTERS}
            enabledFilters={enabledGloryFilters}
            onToggle={handleToggleSubFilter(
              enabledGloryFilters,
              setEnabledGloryFilters,
            )}
          />
          <FiltersGroupToggles
            title="Score type"
            disabled={!enabledCardTypes.includes("Objective")}
            filters={OBJECTIVE_SCORE_TYPE_FILTERS}
            enabledFilters={enabledObjectiveScoreTypes}
            onToggle={handleToggleSubFilter(
              enabledObjectiveScoreTypes,
              setObjectiveScoreTypes,
            )}
          />
          <button
            className="btn btn-red py-3"
            disabled={
              enabledGloryFilters.length === 0 &&
              enabledObjectiveScoreTypes.length === 0
            }
            onClick={handleClearAll}
          >
            Clear All Filters
          </button>
        </div>
      </animated.div>
    </div>
  );
}

export default LibraryFilters;

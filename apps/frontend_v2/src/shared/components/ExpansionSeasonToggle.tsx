import { getSetsBySeason } from "@fxdxpz/wudb";
import type { Set, SetId } from "@fxdxpz/wudb";
import { RivalsDeckIcon } from "./RivalsDeckIcon";

const HEX_BOX_PX = 48;
const HEX_GAP_PX = 6;
const HEX_WIDTH_PX = (HEX_BOX_PX * Math.sqrt(3)) / 2;
const NEIGHBOR_CENTER_DISTANCE_PX = HEX_WIDTH_PX + HEX_GAP_PX;
const HEX_VERTICAL_STEP_PX = (NEIGHBOR_CENTER_DISTANCE_PX * Math.sqrt(3)) / 2;
const HEX_VERTICAL_OVERLAP_PX = HEX_BOX_PX - HEX_VERTICAL_STEP_PX;
const HEX_HORIZONTAL_SHIFT_PX = NEIGHBOR_CENTER_DISTANCE_PX / 2;

interface ExpansionSeasonToggleProps {
  expansions: Set[];
  selectedIds: SetId[];
  onToggle: (setId: SetId) => void;
  disabledIds?: SetId[];
  className?: string;
}

export const ExpansionSeasonToggle = ({
  expansions,
  selectedIds,
  onToggle,
  disabledIds = [],
  className,
}: ExpansionSeasonToggleProps) => {
  const seasonGroups = getSetsBySeason()
    .map((group) => ({
      ...group,
      sets: group.sets.filter((s) => expansions.some((e) => e.id === s.id)),
    }))
    .filter((group) => group.sets.length > 0);

  return (
    <div className={`flex flex-col gap-4 ${className ?? ""}`}>
      {seasonGroups.map(({ season, sets }) => (
        <SeasonGroup
          key={season}
          season={season}
          sets={sets}
          selectedIds={selectedIds}
          disabledIds={disabledIds}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

interface SeasonGroupProps {
  season: string;
  sets: Set[];
  selectedIds: SetId[];
  disabledIds: SetId[];
  onToggle: (setId: SetId) => void;
}

function SeasonGroup({
  season,
  sets,
  selectedIds,
  disabledIds,
  onToggle,
}: SeasonGroupProps) {
  return (
    <article>
      <h6 className="text-xs font-bold text-gray-500">{season}</h6>
      <div className="mt-1 flex flex-col items-start">
        {sets.map((s, i) => (
          <ExpansionToggleItem
            key={s.id}
            set={s}
            index={i}
            stackSize={sets.length}
            isSelected={selectedIds.includes(s.id as SetId)}
            isDisabled={disabledIds.includes(s.id as SetId)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </article>
  );
}

interface ExpansionToggleItemProps {
  set: Set;
  index: number;
  stackSize: number;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: (setId: SetId) => void;
}

function ExpansionToggleItem({
  set,
  index,
  stackSize,
  isSelected,
  isDisabled,
  onToggle,
}: ExpansionToggleItemProps) {
  const shift = index % 2 === 0 ? 0 : HEX_HORIZONTAL_SHIFT_PX;
  return (
    <div
      style={{
        marginTop: index === 0 ? 0 : -HEX_VERTICAL_OVERLAP_PX,
        zIndex: stackSize - index,
      }}
      className={`flex items-center cursor-pointer ${isDisabled ? "grayscale pointer-events-none" : ""} ${isSelected ? "opacity-100" : "opacity-30"}`}
      onClick={() => !isDisabled && onToggle(set.id as SetId)}
    >
      <div style={{ transform: `translateX(${shift}px)` }} className="shrink-0">
        <RivalsDeckIcon
          setName={set.name}
          setId={set.id}
          className="w-12 h-12 drop-shadow-md hover:scale-105 transition-transform"
        />
      </div>
      <span
        style={{ transform: `translateX(${shift}px)` }}
        className="text-sm font-medium ml-2 text-gray-900 whitespace-nowrap"
      >
        {set.displayName}
      </span>
    </div>
  );
}

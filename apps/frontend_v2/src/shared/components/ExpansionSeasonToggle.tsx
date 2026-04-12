import { getSetsBySeason } from "@fxdxpz/wudb";
import type { Set, SetId } from "@fxdxpz/wudb";
import { RivalsDeckIcon } from "./RivalsDeckIcon";

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
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
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
      <div className="mt-1 flex flex-wrap gap-2">
        {sets.map((s) => (
          <ExpansionToggleItem
            key={s.id}
            set={s}
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
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: (setId: SetId) => void;
}

function ExpansionToggleItem({
  set,
  isSelected,
  isDisabled,
  onToggle,
}: ExpansionToggleItemProps) {
  return (
    <div
      className={`cursor-pointer ${isDisabled ? "grayscale pointer-events-none" : ""} ${isSelected ? "opacity-100" : "opacity-30"}`}
      title={set.displayName}
      onClick={() => !isDisabled && onToggle(set.id as SetId)}
    >
      <RivalsDeckIcon
        setName={set.name}
        setId={set.id}
        className="w-12 h-12 drop-shadow-md hover:scale-105 transition-transform"
      />
    </div>
  );
}

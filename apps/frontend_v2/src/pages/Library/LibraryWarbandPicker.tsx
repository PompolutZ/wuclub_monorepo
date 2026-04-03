import CloseIcon from "@icons/x.svg?react";
import { FactionPicture } from "@components/FactionDeckPicture";
import IconButton from "../../shared/components/IconButton";
import SectionTitle from "../../shared/components/SectionTitle";

const GA_LABELS: Record<number, string> = {
  38: "Order",
  39: "Chaos",
  40: "Death",
  41: "Destruction",
};

export type Warband = {
  id: string;
  name: string;
  displayName: string;
  gaId?: number;
};

interface LibraryWarbandPickerProps {
  warbands: Warband[];
  selected: Warband;
  onSelect: (warband: Warband) => void;
  onClose?: () => void;
}

function groupByGA(warbands: Warband[]) {
  const groups = new Map<number, Warband[]>();
  for (const w of warbands) {
    const gaId = w.gaId ?? 0;
    if (!groups.has(gaId)) groups.set(gaId, []);
    groups.get(gaId)!.push(w);
  }
  return Array.from(groups.entries()).map(([gaId, factions]) => ({
    gaId,
    factions,
  }));
}

export function LibraryWarbandPicker({
  warbands,
  selected,
  onSelect,
  onClose,
}: LibraryWarbandPickerProps) {
  const groups = groupByGA(warbands);

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center gap-2 mb-1">
        <FactionPicture faction={selected.name} size="w-10 h-10" />
        <span className="flex-1 text-sm font-medium text-gray-700 truncate">
          {selected.displayName}
        </span>
        {onClose && (
          <IconButton
            className="rounded-full px-2 w-11 h-11 grid place-content-center relative hover:bg-gray-100"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        )}
      </div>
      {groups.map(({ gaId, factions }, i) => (
        <div key={gaId}>
          <SectionTitle
            title={GA_LABELS[gaId] ?? "Other"}
            className="my-1 text-xs"
          />
          <div className="flex flex-wrap gap-1 mt-1">
            {factions.map((faction) => (
              <button
                key={faction.id}
                className="[all:unset] [cursor:pointer]"
                onClick={() => onSelect(faction)}
              >
                <div
                  className={`transition-all ${
                    faction.id === selected.id
                      ? "drop-shadow-[0_0_6px_rgba(147,51,234,0.7)]"
                      : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <FactionPicture faction={faction.name} size="w-10 h-10" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

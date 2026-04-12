import { FactionPicture } from "@components/FactionDeckPicture";
import SectionTitle from "./SectionTitle";

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

interface WarbandPickerProps {
  warbands: Warband[];
  selected: Warband;
  onSelect: (warband: Warband) => void;
  iconSize?: string;
}

export function WarbandPicker({
  warbands,
  selected,
  onSelect,
  iconSize = "w-10 h-10",
}: WarbandPickerProps) {
  const groups = groupByGA(warbands);

  return (
    <>
      {groups.map(({ gaId, factions }) => (
        <div key={gaId}>
          <SectionTitle
            title={GA_LABELS[gaId] ?? "Other"}
            className="my-4 text-xs"
          />
          <div className="flex flex-wrap gap-1 mt-1">
            {factions.map((faction) => (
              <button
                key={faction.id}
                className="[all:unset] [cursor:pointer]"
                title={faction.displayName}
                onClick={() => onSelect(faction)}
              >
                <div
                  className={`transition-all ${
                    faction.id === selected.id
                      ? "drop-shadow-[0_0_6px_rgba(147,51,234,0.7)]"
                      : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <FactionPicture faction={faction.name} size={iconSize} />
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

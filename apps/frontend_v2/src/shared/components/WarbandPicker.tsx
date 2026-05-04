import {
  GRAND_ALLIANCE_NAMES,
  groupWarbandsByGrandAlliance,
} from "@fxdxpz/wudb";
import { FactionPicture } from "@components/FactionDeckPicture";
import SectionTitle from "./SectionTitle";

export type Warband = {
  id: string;
  name: string;
  displayName: string;
  gaId?: number;
};

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
  const groups = groupWarbandsByGrandAlliance(warbands);

  return (
    <>
      {groups.map(({ gaId, warbands: factions }) => (
        <div key={gaId}>
          <SectionTitle
            title={GRAND_ALLIANCE_NAMES[gaId] ?? "Other"}
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

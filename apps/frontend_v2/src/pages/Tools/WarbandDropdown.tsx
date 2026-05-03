import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FactionPicture } from "@components/FactionDeckPicture";
import type { Warband } from "@components/WarbandPicker";

type Props = {
  warbands: Warband[];
  selected: Warband;
  onSelect: (w: Warband) => void;
};

export const WarbandDropdown = ({ warbands, selected, onSelect }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 w-full border border-gray-300 rounded px-2 py-1 hover:bg-gray-50"
      >
        <FactionPicture faction={selected.name} size="w-6 h-6" />
        <span className="text-sm flex-1 text-left truncate">
          {selected.displayName}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" aria-hidden />
      </button>
      {open && (
        <ul className="absolute z-10 mt-1 w-full max-h-64 overflow-auto border border-gray-300 rounded bg-white shadow">
          {warbands.map((w) => (
            <li key={w.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(w);
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full px-2 py-1 text-sm hover:bg-gray-100 text-left"
              >
                <FactionPicture faction={w.name} size="w-5 h-5" />
                <span className="truncate">{w.displayName}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

import CloseIcon from "@icons/x.svg?react";
import { FactionPicture } from "@components/FactionDeckPicture";
import IconButton from "../../shared/components/IconButton";
import { WarbandPicker } from "../../shared/components/WarbandPicker";
import type { Warband } from "../../shared/components/WarbandPicker";

interface LibraryWarbandPickerProps {
  warbands: Warband[];
  selected: Warband;
  onSelect: (warband: Warband) => void;
  onClose?: () => void;
}

export function LibraryWarbandPicker({
  warbands,
  selected,
  onSelect,
  onClose,
}: LibraryWarbandPickerProps) {
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
      <WarbandPicker
        warbands={warbands}
        selected={selected}
        onSelect={onSelect}
      />
    </div>
  );
}

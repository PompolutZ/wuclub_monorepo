import { useEffect, useState } from "react";
import { wufactions } from "../data/wudb";
import { Factions } from "@fxdxpz/schema";

function FactionIcon({ faction }: { faction: Factions }) {
  return (
    <img
      alt={faction}
      className={`w-8 h-8`}
      src={`/assets/icons/${faction}-icon.png`}
    />
  );
}

function FactionIconToggle({
  faction,
  isOn,
  onSelect,
}: {
  faction: Factions;
  isOn: boolean;
  onSelect: (faction: Factions) => void;
}) {
  return (
    <button
      className={`mx-4 my-2 cursor-pointer flex justify-center focus:outline-none w-8 h-8 transform transition-transform duration-300 filter ${
        isOn
          ? "opacity-100 scale-125 drop-shadow-md"
          : "opacity-75 scale-100 hover:scale-105 drop-shadow-sm"
      }`}
      onClick={() => onSelect(faction)}
    >
      <FactionIcon faction={faction} />
    </button>
  );
}

function AvatarPicker({
  current,
  onSelectionChange,
}: {
  current: Factions;
  onSelectionChange: (faction: Factions) => void;
}) {
  const factions = Object.values(wufactions)
    .filter((f) => f.id > 1)
    .sort((prev, next) => next.id - prev.id)
    .map((f) => f.name as Factions);

  const [selectedIcon, setSelectedIcon] = useState(
    current ? current : factions[factions.length],
  );

  useEffect(() => {
    setSelectedIcon(current);
  }, [current]);

  const selectIcon = (faction: Factions) => {
    setSelectedIcon(faction);
    onSelectionChange(faction);
  };

  return (
    <div className="grid grid-cols-5">
      {factions.map((faction) => (
        <FactionIconToggle
          key={faction}
          faction={faction}
          isOn={selectedIcon === faction}
          onSelect={selectIcon}
        />
      ))}
    </div>
  );
}

export default AvatarPicker;

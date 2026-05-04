import { useState } from "react";
import { Minus, Plus } from "lucide-react";

type DiceKind = "attack" | "defence";
const MIN_COUNT = 1;
const MAX_COUNT = 9;

export const DiceRoller = () => {
  const [attack, setAttack] = useState(1);
  const [defence, setDefence] = useState(1);
  const [rolling, setRolling] = useState<DiceKind | null>(null);

  const roll = async (kind: DiceKind, count: number) => {
    if (rolling) return;
    setRolling(kind);
    try {
      const service = await import("@/services/diceBoxService");
      await service.rollOnce(`${count}d${kind}`);
    } finally {
      setRolling(null);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <DiceGroup
        label="Attack"
        count={attack}
        setCount={setAttack}
        onRoll={() => roll("attack", attack)}
        disabled={rolling !== null}
        rolling={rolling === "attack"}
      />
      <DiceGroup
        label="Defence"
        count={defence}
        setCount={setDefence}
        onRoll={() => roll("defence", defence)}
        disabled={rolling !== null}
        rolling={rolling === "defence"}
      />
    </div>
  );
};

type DiceGroupProps = {
  label: string;
  count: number;
  setCount: (n: number) => void;
  onRoll: () => void;
  disabled: boolean;
  rolling: boolean;
};

const DiceGroup = ({
  label,
  count,
  setCount,
  onRoll,
  disabled,
  rolling,
}: DiceGroupProps) => (
  <div className="flex items-center gap-1">
    <button
      type="button"
      onClick={() => setCount(Math.max(MIN_COUNT, count - 1))}
      disabled={disabled || count <= MIN_COUNT}
      aria-label={`One less ${label.toLowerCase()} die`}
      className="grid place-items-center w-7 h-7 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Minus className="w-3.5 h-3.5" aria-hidden />
    </button>
    <button
      type="button"
      onClick={onRoll}
      disabled={disabled}
      className="px-3 py-1 rounded border border-gray-300 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed tabular-nums"
    >
      {rolling ? "Rolling…" : `Roll ${count} ${label}`}
    </button>
    <button
      type="button"
      onClick={() => setCount(Math.min(MAX_COUNT, count + 1))}
      disabled={disabled || count >= MAX_COUNT}
      aria-label={`One more ${label.toLowerCase()} die`}
      className="grid place-items-center w-7 h-7 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Plus className="w-3.5 h-3.5" aria-hidden />
    </button>
  </div>
);

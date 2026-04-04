import { useMemo } from "react";
import { CardsList } from "./CardsList";
import type { EnrichedCard } from "../../reducer";
import GloryIcon from "@icons/wu-glory.svg?react";
import { CardSectionPanel } from "./CardSectionPanel";

interface UpgradesListProps {
  selectedUpgrades: EnrichedCard[];
  format: string;
  isValid: boolean;
}

export function UpgradesList({
  selectedUpgrades,
  format,
  isValid,
}: UpgradesListProps) {
  const totalGlory = useMemo(() => {
    return selectedUpgrades.reduce((sum, c) => sum + (c.glory ?? 0), 0);
  }, [selectedUpgrades]);

  return (
    <CardSectionPanel
      type="Upgrades"
      amount={selectedUpgrades.length}
      isValid={isValid}
      headerExtra={
        <div className="flex items-center ml-2 text-sm text-gray-800">
          <GloryIcon className="bg-gray-400 rounded-full w-5 h-5 fill-current" />
          {totalGlory}
        </div>
      }
    >
      <CardsList format={format} cards={selectedUpgrades} />
    </CardSectionPanel>
  );
}

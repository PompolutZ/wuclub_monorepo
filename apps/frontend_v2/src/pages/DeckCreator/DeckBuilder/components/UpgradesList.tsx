import { useMemo } from "react";
import { CardsList } from "./CardsList";
import { CardListSectionHeader } from "../../../../shared/components/CardListSectionHeader";
import { ExpandCollapseButton } from "../../../../shared/components/ExpandCollapseButton";
import { useResizeHeight } from "../../../../hooks/useResizeHeight";
import { animated, useSpring } from "@react-spring/web";
import type { EnrichedCard } from "../../reducer";
import GloryIcon from "@icons/wu-glory.svg?react";

interface UpgradesListProps {
    selectedUpgrades: EnrichedCard[];
    format: string;
    isValid: boolean;
}

function UpgradesList({ selectedUpgrades, format, isValid }: UpgradesListProps) {
  const [measureRef, open, toggle, contentHeight] = useResizeHeight({
    open: true,
  });
  const expand = useSpring({
    height: open ? `${contentHeight}px` : "0px",
  });

  const totalGlory = useMemo(() => {
    return selectedUpgrades.reduce((sum, c) => sum + (c.glory ?? 0), 0);
  }, [selectedUpgrades]);

  return (
    <div
      className={`${isValid ? "bg-green-100" : "bg-red-200"} p-2 mb-4 lg:mb-0`}
    >
      <CardListSectionHeader type="Upgrades" amount={selectedUpgrades.length}>
        <>
          <div className="flex items-center ml-2 text-sm text-gray-800">
            <GloryIcon className="bg-gray-400 rounded-full w-5 h-5 fill-current" />
            {totalGlory}
          </div>
          <ExpandCollapseButton
            open={open}
            className="ml-auto lg:hidden outline-none shadow-md text-white bg-purple-700 rounded-full hover:bg-purple-500 focus:text-white"
            onClick={toggle}
          />
        </>
      </CardListSectionHeader>

      <animated.div style={expand} className="overflow-hidden">
        <div ref={measureRef}>
          <CardsList format={format} cards={selectedUpgrades} />
        </div>
      </animated.div>
    </div>
  );
}

export default UpgradesList;

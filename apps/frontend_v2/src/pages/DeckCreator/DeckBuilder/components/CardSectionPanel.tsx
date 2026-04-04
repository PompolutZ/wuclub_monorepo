import { animated, useSpring } from "@react-spring/web";
import { ReactNode } from "react";
import { useResizeHeight } from "../../../../hooks/useResizeHeight";
import { CardListSectionHeader } from "../../../../shared/components/CardListSectionHeader";
import { ExpandCollapseButton } from "../../../../shared/components/ExpandCollapseButton";

interface CardSectionPanelProps {
  type: "Objectives" | "Gambits" | "Upgrades";
  amount: number;
  isValid: boolean;
  headerExtra?: ReactNode;
  children: ReactNode;
}

export function CardSectionPanel({
  type,
  amount,
  isValid,
  headerExtra,
  children,
}: CardSectionPanelProps) {
  const [measureRef, open, toggle, contentHeight] = useResizeHeight({
    open: amount > 0,
  });
  const expand = useSpring({
    height: open ? `${contentHeight}px` : "0px",
  });

  return (
    <div
      className={`${isValid ? "bg-green-100" : "bg-accent3-100/30"} mb-4 lg:mb-0`}
    >
      <CardListSectionHeader
        className="border-none p-3"
        type={type}
        amount={amount}
      >
        <>
          {headerExtra}
          <ExpandCollapseButton
            open={open}
            className="ml-auto lg:hidden outline-none shadow-md text-white bg-purple-700 rounded-full hover:bg-purple-500 focus:text-white"
            onClick={toggle}
          />
        </>
      </CardListSectionHeader>

      <animated.div style={expand} className="overflow-hidden">
        <div ref={measureRef} className="px-2 pb-3">
          {children}
        </div>
      </animated.div>
    </div>
  );
}

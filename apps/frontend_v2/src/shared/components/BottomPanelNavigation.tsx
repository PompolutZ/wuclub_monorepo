import React from "react";

type Tab = {
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
};

type BottomPanelNavigationProps = {
  activeTabIndex: number;
  setActiveTabIndex: (activeIndex: number) => void;
  tabs: Tab[];
  orientation?: "horizontal" | "vertical";
};

function getGradientStyle(
  activeTabIndex: number,
  tabCount: number,
  orientation: "horizontal" | "vertical",
): React.CSSProperties {
  if (tabCount === 0) return {};
  const pos = tabCount === 1 ? 50 : (activeTabIndex / (tabCount - 1)) * 100;
  const spread = Math.min(30, 100 / tabCount);
  const dir = orientation === "horizontal" ? "to right" : "to bottom";
  return {
    background: `linear-gradient(${dir}, #f3f4f6 ${pos - spread}%, #e9d5ff ${pos}%, #f3f4f6 ${pos + spread}%)`,
    transition: "background 500ms",
  };
}

function BottomPanelNavigation({
  activeTabIndex,
  setActiveTabIndex,
  tabs,
  orientation = "horizontal",
}: BottomPanelNavigationProps) {
  return (
    <div
      className={`flex ${orientation === "vertical" ? "flex-col" : ""}`}
      style={getGradientStyle(activeTabIndex, tabs.length, orientation)}
    >
      {tabs.map(({ name, Icon, disabled }: Tab, index: number) => (
        <button
          key={name}
          className={`flex-1 flex flex-col items-center py-2 text-xs
                ${
                  disabled
                    ? "text-gray-400"
                    : activeTabIndex === index
                      ? "text-purple-700"
                      : "text-gray-700"
                }`}
          onClick={() => setActiveTabIndex(index)}
          disabled={disabled}
        >
          <Icon
            className={`h-6 mb-1 ${disabled ? "fill-gray-400" : "fill-current"}`}
          />
          {name}
        </button>
      ))}
    </div>
  );
}

export default BottomPanelNavigation;

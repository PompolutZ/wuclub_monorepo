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
): React.CSSProperties {
  if (tabCount === 0) return {};
  const pos = tabCount === 1 ? 50 : (activeTabIndex / (tabCount - 1)) * 100;
  const spread = Math.min(30, 100 / tabCount);
  return {
    background: `linear-gradient(to right, #f3f4f6 ${pos - spread}%, #e9d5ff ${pos}%, #f3f4f6 ${pos + spread}%)`,
    transition: "background 500ms",
  };
}

const getButtonClassName = (
  isActive: boolean,
  disabled: boolean,
  isVertical: boolean,
) => {
  const base = "flex flex-col items-center text-xs";
  if (isVertical) {
    const color = disabled
      ? "text-gray-400"
      : isActive
        ? "text-purple-700 shadow-[0_0_16px_rgba(126,34,206,0.4)]"
        : "text-gray-700 hover:shadow-[0_0_12px_rgba(126,34,206,0.25)]";
    return `${base} py-3 px-4 rounded-xl transition-all duration-300 ${color}`;
  }
  const color = disabled
    ? "text-gray-400"
    : isActive
      ? "text-purple-700"
      : "text-gray-700";
  return `${base} flex-1 py-2 ${color}`;
};

function BottomPanelNavigation({
  activeTabIndex,
  setActiveTabIndex,
  tabs,
  orientation = "horizontal",
}: BottomPanelNavigationProps) {
  const isVertical = orientation === "vertical";

  const containerClassName = isVertical
    ? "flex flex-col items-center justify-center gap-4 bg-zinc-300 shrink-0"
    : "flex shrink-0";

  const containerStyle = isVertical
    ? undefined
    : getGradientStyle(activeTabIndex, tabs.length);

  return (
    <div className={containerClassName} style={containerStyle}>
      {tabs.map(({ name, Icon, disabled = false }: Tab, index: number) => {
        const isActive = activeTabIndex === index;
        return (
          <button
            key={name}
            className={getButtonClassName(isActive, disabled, isVertical)}
            onClick={() => setActiveTabIndex(index)}
            disabled={disabled}
          >
            <Icon
              className={`h-6 mb-1 ${disabled ? "fill-gray-400" : "fill-current"}`}
            />
            {name}
          </button>
        );
      })}
    </div>
  );
}

export default BottomPanelNavigation;

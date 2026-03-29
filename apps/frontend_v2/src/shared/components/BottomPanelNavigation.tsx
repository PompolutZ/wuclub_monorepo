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
};

function getGradientClass(activeTabIndex: number, tabCount: number): string {
  if (tabCount === 2) {
    return activeTabIndex === 0
      ? "from-purple-200 to-gray-100"
      : "from-gray-100 to-purple-200";
  }
  if (activeTabIndex === 0) return "from-purple-200 via-gray-100 to-gray-100";
  if (activeTabIndex === 1) return "from-gray-100 via-purple-200 to-gray-100";
  return "from-gray-100 via-gray-100 to-purple-200";
}

function BottomPanelNavigation({
  activeTabIndex,
  setActiveTabIndex,
  tabs,
}: BottomPanelNavigationProps) {
  return (
    <div
      className={`flex transition-colors duration-500 bg-gradient-to-r ${getGradientClass(activeTabIndex, tabs.length)}`}
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

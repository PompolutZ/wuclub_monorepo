import { ReactNode } from "react";
import ToggleButton from "../ToggleButton";
import type { FilterConfig } from "./constants/cardTypeFilters";

interface FiltersGroupTogglesProps {
  title: string;
  filters: FilterConfig[];
  enabledFilters?: string[];
  disabled?: boolean;
  onToggle: (label: string) => () => void;
}

function FiltersGroupToggles({
  title,
  filters,
  enabledFilters = [],
  disabled,
  onToggle,
}: FiltersGroupTogglesProps) {
  return (
    <div className="mb-8">
      <div className="uppercase mb-4">{title}</div>
      <div className="flex space-x-1">
        {filters.map((value) => (
          <ToggleButton
            disabled={disabled}
            isOn={enabledFilters.includes(value.label)}
            className={"flex-1 text-sm border-2"}
            on="text-purple-700 border-purple-700 bg-purple-100"
            key={value.label}
            onClick={onToggle(value.label)}
          >
            {value.icon || value.label}
          </ToggleButton>
        ))}
      </div>
    </div>
  );
}

export default FiltersGroupToggles;

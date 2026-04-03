import ObjectiveScoreTypeIcon from "../../../../../../components/ObjectiveScoreTypeIcon";
import type { FilterConfig } from "./cardTypeFilters";

export const OBJECTIVE_SCORE_TYPE_FILTERS: FilterConfig[] = [
  {
    label: "Surge",
    icon: (
      <ObjectiveScoreTypeIcon
        type="Surge"
        style={{ width: "1rem", height: "1rem" }}
      />
    ),
    filter: (card) => card.scoreType === "Surge",
  },
  {
    label: "End phase",
    icon: (
      <ObjectiveScoreTypeIcon
        type="End"
        style={{ width: "1rem", height: "1rem" }}
      />
    ),
    filter: (card) => card.scoreType === "End",
  },
];

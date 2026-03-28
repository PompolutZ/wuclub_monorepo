import { setHasPlot } from "@wudb/index";
import type { SetId } from "../../../data/wudb/types";

export const getPlotKeywords = (sets: string[]) => {
  if (!sets.some((setId) => setHasPlot(setId as SetId))) return [];

  // plot keyword retrieval not yet implemented
};

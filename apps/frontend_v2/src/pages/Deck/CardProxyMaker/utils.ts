import { checkDeckHasPlots } from "@wudb/index";
import type { SetId } from "../../../data/wudb/types";

export const getPlotSetIds = (sets: string[]): string[] =>
  checkDeckHasPlots(sets as SetId[]).map((set) => set.id);

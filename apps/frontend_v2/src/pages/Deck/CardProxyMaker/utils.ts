import { checkDeckHasPlots } from "@fxdxpz/wudb";
import type { SetId } from "@fxdxpz/wudb";

export const getPlotSetIds = (sets: string[]): string[] =>
  checkDeckHasPlots(sets as SetId[]).map((set) => set.id);

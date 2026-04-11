import { useMemo } from "react";
import type { DeckCard } from "../types";

type ScoreType = "Surge" | "End" | "Third";

export function useObjectiveSummary(objectives: DeckCard[]) {
  return useMemo(() => {
    const summary = objectives.reduce(
      (r, c) => {
        const key = c?.scoreType;
        if (key && (key as string) !== "-" && key in r) {
          r[key as ScoreType] += 1;
        }
        return r;
      },
      { Surge: 0, End: 0, Third: 0 } as Record<ScoreType, number>,
    );

    const totalGlory = objectives.reduce(
      (acc, c) => acc + Number(c.glory ?? 0),
      0,
    );

    return { summary, totalGlory };
  }, [objectives]);
}

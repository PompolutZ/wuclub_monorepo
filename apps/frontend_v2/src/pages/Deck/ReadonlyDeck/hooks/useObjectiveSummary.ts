import { useMemo } from "react";
import { Set } from "immutable";
import type { DeckCard } from "../types";

export function useObjectiveSummary(objectives: DeckCard[]) {
  return useMemo(() => {
    const summary = Set(objectives)
      .groupBy((c) => c?.scoreType ?? "-")
      .reduce(
        (r, v, k) => {
          if (v && r && k) {
            const key = k as "Surge" | "End" | "Third" | "-";
            if (key !== "-") {
              r[key] = v.count();
            }
          }
          return r ?? { Surge: 0, End: 0, Third: 0 };
        },
        { Surge: 0, End: 0, Third: 0 } as {
          Surge: number;
          End: number;
          Third: number;
        },
      );

    const totalGlory = objectives.reduce(
      (acc, c) => acc + Number(c.glory ?? 0),
      0,
    );

    return { summary, totalGlory };
  }, [objectives]);
}

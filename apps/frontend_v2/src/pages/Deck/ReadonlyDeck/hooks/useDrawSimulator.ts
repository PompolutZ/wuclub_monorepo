import { useState, useCallback } from "react";
import type { DeckCard } from "../types";

export type DrawnCard = { card: DeckCard; flipped: boolean };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function draw(pool: DeckCard[], count = 5): DrawnCard[] {
  return shuffle(pool)
    .slice(0, Math.min(count, pool.length))
    .map((card) => ({ card, flipped: false }));
}

export function useDrawSimulator(
  objectives: DeckCard[],
  powerCards: DeckCard[],
) {
  const [objectiveHand, setObjectiveHand] = useState<DrawnCard[]>(() =>
    draw(objectives),
  );
  const [powerHand, setPowerHand] = useState<DrawnCard[]>(() =>
    draw(powerCards),
  );

  const shuffleAndRedraw = useCallback(() => {
    setObjectiveHand(draw(objectives));
    setPowerHand(draw(powerCards));
  }, [objectives, powerCards]);

  const mulliganObjectives = useCallback(() => {
    setObjectiveHand((hand) => {
      const kept = hand.filter((c) => c.flipped);
      const returned = hand.filter((c) => !c.flipped).map((c) => c.card);
      const pool = objectives.filter(
        (c) => !kept.some((k) => k.card.id === c.id),
      );
      const replacement = draw(pool, returned.length);
      return [...kept, ...replacement];
    });
  }, [objectives]);

  const mulliganPowers = useCallback(() => {
    setPowerHand((hand) => {
      const kept = hand.filter((c) => c.flipped);
      const returned = hand.filter((c) => !c.flipped).map((c) => c.card);
      const pool = powerCards.filter(
        (c) => !kept.some((k) => k.card.id === c.id),
      );
      const replacement = draw(pool, returned.length);
      return [...kept, ...replacement];
    });
  }, [powerCards]);

  const mulliganBoth = useCallback(() => {
    mulliganObjectives();
    mulliganPowers();
  }, [mulliganObjectives, mulliganPowers]);

  const toggleCard = useCallback(
    (type: "objective" | "power", index: number) => {
      const setter = type === "objective" ? setObjectiveHand : setPowerHand;
      setter((hand) =>
        hand.map((c, i) => (i === index ? { ...c, flipped: !c.flipped } : c)),
      );
    },
    [],
  );

  return {
    objectiveHand,
    powerHand,
    shuffleAndRedraw,
    mulliganObjectives,
    mulliganPowers,
    mulliganBoth,
    toggleCard,
  };
}

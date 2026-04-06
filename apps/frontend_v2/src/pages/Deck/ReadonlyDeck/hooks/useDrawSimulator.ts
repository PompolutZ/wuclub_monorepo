import { useState, useCallback } from "react";
import type { DeckCard } from "../types";

const OBJECTIVE_DRAW = 3;
const POWER_DRAW = 5;

export type SimulatorCard = {
  card: DeckCard;
  drawn: boolean;
  faceUp: boolean;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildHand(pool: DeckCard[], count: number): SimulatorCard[] {
  const shuffled = shuffle(pool);
  const drawCount = Math.min(count, pool.length);
  return [
    ...shuffled.slice(0, drawCount).map((card) => ({ card, drawn: true, faceUp: true })),
    ...shuffled.slice(drawCount).map((card) => ({ card, drawn: false, faceUp: false })),
  ];
}

function mulliganHand(cards: SimulatorCard[], count: number): SimulatorCard[] {
  const kept = cards.filter((c) => c.drawn && c.faceUp);
  const keptIds = new Set(kept.map((c) => c.card.id));
  const available = shuffle(cards.filter((c) => !keptIds.has(c.card.id)).map((c) => c.card));
  const drawCount = Math.min(count - kept.length, available.length);
  return [
    ...kept,
    ...available.slice(0, drawCount).map((card) => ({ card, drawn: true, faceUp: true })),
    ...available.slice(drawCount).map((card) => ({ card, drawn: false, faceUp: false })),
  ];
}

export function useDrawSimulator(objectives: DeckCard[], powerCards: DeckCard[]) {
  const [objectiveCards, setObjectiveCards] = useState<SimulatorCard[]>(() =>
    buildHand(objectives, OBJECTIVE_DRAW),
  );
  const [simPowerCards, setSimPowerCards] = useState<SimulatorCard[]>(() =>
    buildHand(powerCards, POWER_DRAW),
  );

  const shuffleAndRedraw = useCallback(() => {
    setObjectiveCards(buildHand(objectives, OBJECTIVE_DRAW));
    setSimPowerCards(buildHand(powerCards, POWER_DRAW));
  }, [objectives, powerCards]);

  const mulliganObjectives = useCallback(() => {
    setObjectiveCards((cards) => mulliganHand(cards, OBJECTIVE_DRAW));
  }, []);

  const mulliganPowers = useCallback(() => {
    setSimPowerCards((cards) => mulliganHand(cards, POWER_DRAW));
  }, []);

  const mulliganBoth = useCallback(() => {
    mulliganObjectives();
    mulliganPowers();
  }, [mulliganObjectives, mulliganPowers]);

  const toggleCard = useCallback((type: "objective" | "power", cardId: string) => {
    const setter = type === "objective" ? setObjectiveCards : setSimPowerCards;
    setter((cards) =>
      cards.map((c) =>
        c.card.id === cardId ? { ...c, faceUp: !c.faceUp } : c,
      ),
    );
  }, []);

  return {
    objectiveCards,
    powerCards: simPowerCards,
    shuffleAndRedraw,
    mulliganObjectives,
    mulliganPowers,
    mulliganBoth,
    toggleCard,
  };
}

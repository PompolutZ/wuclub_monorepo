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
    ...shuffled
      .slice(0, drawCount)
      .map((card) => ({ card, drawn: true, faceUp: true })),
    ...shuffled
      .slice(drawCount)
      .map((card) => ({ card, drawn: false, faceUp: false })),
  ];
}

function mulliganHand(cards: SimulatorCard[], count: number): SimulatorCard[] {
  const setAside = cards.filter((c) => c.drawn).map((c) => c.card);
  // Preserve existing deck order — no reshuffle before drawing
  const deck = cards.filter((c) => !c.drawn).map((c) => c.card);
  const drawCount = Math.min(count, deck.length);
  const newDrawn = deck.slice(0, drawCount);
  const leftover = deck.slice(drawCount);
  // After drawing, combine leftover + set-aside and reshuffle
  const reshuffled = shuffle([...leftover, ...setAside]);
  return [
    ...newDrawn.map((card) => ({ card, drawn: true, faceUp: true })),
    ...reshuffled.map((card) => ({ card, drawn: false, faceUp: false })),
  ];
}

export function useDrawSimulator(
  objectives: DeckCard[],
  powerCards: DeckCard[],
) {
  const [objectiveCards, setObjectiveCards] = useState<SimulatorCard[]>(() =>
    buildHand(objectives, OBJECTIVE_DRAW),
  );
  const [simPowerCards, setSimPowerCards] = useState<SimulatorCard[]>(() =>
    buildHand(powerCards, POWER_DRAW),
  );
  const [mulliganed, setMulliganed] = useState(false);

  const shuffleAndRedraw = useCallback(() => {
    setObjectiveCards(buildHand(objectives, OBJECTIVE_DRAW));
    setSimPowerCards(buildHand(powerCards, POWER_DRAW));
    setMulliganed(false);
  }, [objectives, powerCards]);

  const mulliganObjectives = useCallback(() => {
    setObjectiveCards((cards) => mulliganHand(cards, OBJECTIVE_DRAW));
    setMulliganed(true);
  }, []);

  const mulliganPowers = useCallback(() => {
    setSimPowerCards((cards) => mulliganHand(cards, POWER_DRAW));
    setMulliganed(true);
  }, []);

  const mulliganBoth = useCallback(() => {
    setObjectiveCards((cards) => mulliganHand(cards, OBJECTIVE_DRAW));
    setSimPowerCards((cards) => mulliganHand(cards, POWER_DRAW));
    setMulliganed(true);
  }, []);

  const toggleCard = useCallback(
    (type: "objective" | "power", cardId: string) => {
      const setter =
        type === "objective" ? setObjectiveCards : setSimPowerCards;
      setter((cards) =>
        cards.map((c) =>
          c.card.id === cardId ? { ...c, faceUp: !c.faceUp } : c,
        ),
      );
    },
    [],
  );

  return {
    objectiveCards,
    powerCards: simPowerCards,
    mulliganed,
    shuffleAndRedraw,
    mulliganObjectives,
    mulliganPowers,
    mulliganBoth,
    toggleCard,
  };
}

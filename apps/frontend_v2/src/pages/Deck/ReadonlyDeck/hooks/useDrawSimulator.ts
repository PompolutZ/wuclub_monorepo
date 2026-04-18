import { useEffect, useState, useCallback } from "react";
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

function extractDrawn(
  objectives: SimulatorCard[],
  powers: SimulatorCard[],
): DeckCard[] {
  return [
    ...objectives.filter((c) => c.drawn).map((c) => c.card),
    ...powers.filter((c) => c.drawn).map((c) => c.card),
  ];
}

export function useDrawSimulator(
  objectives: DeckCard[],
  powerCards: DeckCard[],
  onHandChange?: (hand: DeckCard[]) => void,
) {
  const [objectiveCards, setObjectiveCards] = useState<SimulatorCard[]>(() =>
    buildHand(objectives, OBJECTIVE_DRAW),
  );
  const [simPowerCards, setSimPowerCards] = useState<SimulatorCard[]>(() =>
    buildHand(powerCards, POWER_DRAW),
  );
  const [mulliganed, setMulliganed] = useState(false);

  // One-time notification of the initial draw. Subsequent changes are
  // broadcast imperatively from each action below.
  useEffect(() => {
    onHandChange?.(extractDrawn(objectiveCards, simPowerCards));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shuffleAndRedraw = useCallback(() => {
    const nextObj = buildHand(objectives, OBJECTIVE_DRAW);
    const nextPow = buildHand(powerCards, POWER_DRAW);
    setObjectiveCards(nextObj);
    setSimPowerCards(nextPow);
    setMulliganed(false);
    onHandChange?.(extractDrawn(nextObj, nextPow));
  }, [objectives, powerCards, onHandChange]);

  const mulliganObjectives = useCallback(() => {
    const nextObj = mulliganHand(objectiveCards, OBJECTIVE_DRAW);
    setObjectiveCards(nextObj);
    setMulliganed(true);
    onHandChange?.(extractDrawn(nextObj, simPowerCards));
  }, [objectiveCards, simPowerCards, onHandChange]);

  const mulliganPowers = useCallback(() => {
    const nextPow = mulliganHand(simPowerCards, POWER_DRAW);
    setSimPowerCards(nextPow);
    setMulliganed(true);
    onHandChange?.(extractDrawn(objectiveCards, nextPow));
  }, [objectiveCards, simPowerCards, onHandChange]);

  const mulliganBoth = useCallback(() => {
    const nextObj = mulliganHand(objectiveCards, OBJECTIVE_DRAW);
    const nextPow = mulliganHand(simPowerCards, POWER_DRAW);
    setObjectiveCards(nextObj);
    setSimPowerCards(nextPow);
    setMulliganed(true);
    onHandChange?.(extractDrawn(nextObj, nextPow));
  }, [objectiveCards, simPowerCards, onHandChange]);

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

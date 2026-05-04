import { lazy, Suspense, useMemo, useState } from "react";
import {
  checkCardIsObjective,
  checkCardIsPloy,
  checkCardIsUpgrade,
  type Card,
} from "@fxdxpz/wudb";
import { LazyLoading } from "@/components/LazyLoading";
import { setHostHand } from "./roomStore";

const DrawSimulator = lazy(
  () => import("@/pages/Deck/ReadonlyDeck/atoms/DrawSimulator"),
);

type DrawCardsStepProps = {
  roomId: string;
  deckCards: Card[];
};

export const DrawCardsStep = ({ roomId, deckCards }: DrawCardsStepProps) => {
  const { objectives, gambits, upgrades } = useMemo(
    () => ({
      objectives: deckCards.filter(checkCardIsObjective),
      gambits: deckCards.filter(checkCardIsPloy),
      upgrades: deckCards.filter(checkCardIsUpgrade),
    }),
    [deckCards],
  );

  const [hand, setHand] = useState<Card[]>([]);

  const handleAccept = () => {
    if (hand.length === 0) return;
    setHostHand(roomId, hand);
  };

  return (
    <section className="flex-1 flex flex-col max-w-5xl w-full mx-auto">
      <Suspense fallback={<LazyLoading />}>
        <DrawSimulator
          objectives={objectives}
          gambits={gambits}
          upgrades={upgrades}
          onHandChange={setHand}
        />
      </Suspense>
      <div className="flex justify-center pt-4">
        <button
          className="btn btn-purple cursor-pointer px-6 py-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={hand.length === 0}
          onClick={handleAccept}
        >
          Accept and go to the next step
        </button>
      </div>
    </section>
  );
};

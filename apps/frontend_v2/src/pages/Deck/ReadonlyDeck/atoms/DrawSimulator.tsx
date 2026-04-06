import { useRef, useCallback } from "react";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import { CardBack } from "@components/CardBack";
import { CardPicture } from "@components/CardPicture";
import { FlippableCard } from "@components/FlippableCard";
import type { DeckCard } from "../types";
import { useDrawSimulator } from "../hooks/useDrawSimulator";
import type { SimulatorCard } from "../hooks/useDrawSimulator";

type Props = {
  objectives: DeckCard[];
  gambits: DeckCard[];
  upgrades: DeckCard[];
};

const btnClass =
  "px-3 py-1.5 rounded-md text-sm font-medium bg-purple-700 text-white hover:bg-purple-800 active:bg-purple-900 transition-colors";

function CardItem({
  sc,
  backType,
  onToggle,
}: {
  sc: SimulatorCard;
  backType: "objectives" | "power";
  onToggle: () => void;
}) {
  return (
    <FlippableCard
      flipped={sc.faceUp}
      onFlip={sc.drawn ? onToggle : undefined}
      back={<CardBack type={backType} />}
      front={<CardPicture card={sc.card} />}
    />
  );
}

function MobileSection({
  label,
  cards,
  backType,
  scrollRef,
  onToggle,
}: {
  label: string;
  cards: SimulatorCard[];
  backType: "objectives" | "power";
  scrollRef: React.RefObject<HTMLDivElement>;
  onToggle: (id: string) => void;
}) {
  return (
    <section>
      <h2 className="text-gray-900 text-xl px-4 pb-2 font-medium">{label}</h2>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-3 px-4 pb-4 snap-x snap-mandatory"
      >
        {cards.map((sc) => (
          <div key={sc.card.id} className="snap-start shrink-0 w-32">
            <CardItem sc={sc} backType={backType} onToggle={() => onToggle(sc.card.id)} />
          </div>
        ))}
      </div>
    </section>
  );
}

function DesktopSection({
  label,
  cards,
  backType,
  onToggle,
}: {
  label: string;
  cards: SimulatorCard[];
  backType: "objectives" | "power";
  onToggle: (id: string) => void;
}) {
  return (
    <section>
      <h2 className="text-gray-900 text-xl px-4 pb-3 font-medium">{label}</h2>
      <div className="grid grid-cols-3 gap-3 px-4 pb-6">
        {cards.map((sc) => (
          <CardItem key={sc.card.id} sc={sc} backType={backType} onToggle={() => onToggle(sc.card.id)} />
        ))}
      </div>
    </section>
  );
}

export default function DrawSimulator({ objectives, gambits, upgrades }: Props) {
  const isMobile = useBreakpoint("mobile");
  const powerPool = [...gambits, ...upgrades];
  const objScrollRef = useRef<HTMLDivElement>(null);
  const powerScrollRef = useRef<HTMLDivElement>(null);

  const {
    objectiveCards,
    powerCards,
    shuffleAndRedraw,
    mulliganBoth,
    mulliganObjectives,
    mulliganPowers,
    toggleCard,
  } = useDrawSimulator(objectives, powerPool);

  const resetScrolls = useCallback(() => {
    if (objScrollRef.current) objScrollRef.current.scrollLeft = 0;
    if (powerScrollRef.current) powerScrollRef.current.scrollLeft = 0;
  }, []);

  const handleShuffleAndRedraw = useCallback(() => {
    shuffleAndRedraw();
    resetScrolls();
  }, [shuffleAndRedraw, resetScrolls]);

  const handleMulliganBoth = useCallback(() => {
    mulliganBoth();
    resetScrolls();
  }, [mulliganBoth, resetScrolls]);

  const handleMulliganObjectives = useCallback(() => {
    mulliganObjectives();
    if (objScrollRef.current) objScrollRef.current.scrollLeft = 0;
  }, [mulliganObjectives]);

  const handleMulliganPowers = useCallback(() => {
    mulliganPowers();
    if (powerScrollRef.current) powerScrollRef.current.scrollLeft = 0;
  }, [mulliganPowers]);

  const drawnObjectives = objectiveCards.filter((c) => c.drawn).length;
  const drawnPowers = powerCards.filter((c) => c.drawn).length;

  return (
    <div className="flex-1 relative">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex flex-wrap gap-2 p-4">
          <button className={btnClass} onClick={handleShuffleAndRedraw}>
            Shuffle &amp; Redraw
          </button>
          <button className={btnClass} onClick={handleMulliganBoth}>
            Mulligan Both
          </button>
          <button className={btnClass} onClick={handleMulliganObjectives}>
            Mulligan Objectives
          </button>
          <button className={btnClass} onClick={handleMulliganPowers}>
            Mulligan Powers
          </button>
        </div>

        {isMobile ? (
          <>
            <MobileSection
              label={`${drawnObjectives} Objectives drawn`}
              cards={objectiveCards}
              backType="objectives"
              scrollRef={objScrollRef}
              onToggle={(id) => toggleCard("objective", id)}
            />
            <MobileSection
              label={`${drawnPowers} Power Cards drawn`}
              cards={powerCards}
              backType="power"
              scrollRef={powerScrollRef}
              onToggle={(id) => toggleCard("power", id)}
            />
          </>
        ) : (
          <div className="grid grid-cols-2 gap-6 px-2">
            <DesktopSection
              label={`${drawnObjectives} Objectives drawn`}
              cards={objectiveCards}
              backType="objectives"
              onToggle={(id) => toggleCard("objective", id)}
            />
            <DesktopSection
              label={`${drawnPowers} Power Cards drawn`}
              cards={powerCards}
              backType="power"
              onToggle={(id) => toggleCard("power", id)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

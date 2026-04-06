import { useBreakpoint } from "@/hooks/useMediaQuery";
import { CardBack } from "@components/CardBack";
import { CardPicture } from "@components/CardPicture";
import { FlippableCard } from "@components/FlippableCard";
import type { DeckCard } from "../types";
import { useDrawSimulator } from "../hooks/useDrawSimulator";
import type { DrawnCard } from "../hooks/useDrawSimulator";

type Props = {
  objectives: DeckCard[];
  gambits: DeckCard[];
  upgrades: DeckCard[];
};

const btnClass =
  "px-3 py-1.5 rounded-md text-sm font-medium bg-purple-700 text-white hover:bg-purple-800 active:bg-purple-900 transition-colors";

function HandSection({
  label,
  hand,
  backType,
  isMobile,
  onToggle,
}: {
  label: string;
  hand: DrawnCard[];
  backType: "objectives" | "power";
  isMobile: boolean;
  onToggle: (i: number) => void;
}) {
  return (
    <section>
      <h2 className="text-gray-900 text-xl px-4 pb-2 font-medium">{label}</h2>
      {isMobile ? (
        <div className="flex overflow-x-auto gap-3 px-4 pb-4 snap-x snap-mandatory">
          {hand.map((dc, i) => (
            <div key={dc.card.id} className="snap-start shrink-0 w-36">
              <FlippableCard
                flipped={dc.flipped}
                onFlip={() => onToggle(i)}
                back={<CardBack type={backType} />}
                front={<CardPicture card={dc.card} />}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 px-4 pb-6">
          {hand.map((dc, i) => (
            <FlippableCard
              key={dc.card.id}
              flipped={dc.flipped}
              onFlip={() => onToggle(i)}
              back={<CardBack type={backType} />}
              front={<CardPicture card={dc.card} />}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function DrawSimulator({ objectives, gambits, upgrades }: Props) {
  const isMobile = useBreakpoint("mobile");
  const powerCards = [...gambits, ...upgrades];
  const {
    objectiveHand,
    powerHand,
    shuffleAndRedraw,
    mulliganBoth,
    mulliganObjectives,
    mulliganPowers,
    toggleCard,
  } = useDrawSimulator(objectives, powerCards);

  return (
    <div className="flex-1 relative">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex flex-wrap gap-2 p-4">
          <button className={btnClass} onClick={shuffleAndRedraw}>
            Shuffle &amp; Redraw
          </button>
          <button className={btnClass} onClick={mulliganBoth}>
            Mulligan Both
          </button>
          <button className={btnClass} onClick={mulliganObjectives}>
            Mulligan Objectives
          </button>
          <button className={btnClass} onClick={mulliganPowers}>
            Mulligan Powers
          </button>
        </div>

        <HandSection
          label={`${objectiveHand.length} Objectives`}
          hand={objectiveHand}
          backType="objectives"
          isMobile={isMobile}
          onToggle={(i) => toggleCard("objective", i)}
        />

        <HandSection
          label={`${powerHand.length} Power Cards`}
          hand={powerHand}
          backType="power"
          isMobile={isMobile}
          onToggle={(i) => toggleCard("power", i)}
        />
      </div>
    </div>
  );
}

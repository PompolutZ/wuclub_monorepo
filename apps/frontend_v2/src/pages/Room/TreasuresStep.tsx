import { useMemo } from "react";
import { shuffle } from "@/utils/functions";
import { boards } from "../../../../../shared/boards";
import { BoardOverlay } from "./BoardOverlay";
import { boardOverlayConfigs } from "./boardOverlayConfigs";
import type { BoardSetup } from "./roomStore";

type TreasuresStepProps = {
  boardSetup: BoardSetup;
};

export const TreasuresStep = ({ boardSetup }: TreasuresStepProps) => {
  const board = boards.find((b) => b.id === boardSetup.boardId);
  if (!board) return null;
  const config = boardOverlayConfigs[board.id];

  return (
    <section className="flex flex-col items-center space-y-4 max-w-4xl mx-auto w-full">
      <p className="text-sm text-gray-700 text-center">
        <span className="font-semibold">{board.name}</span>
      </p>
      <div className="flex items-start gap-6 w-full">
        <div className="relative flex-1 max-w-xl">
          <BoardOverlay
            board={board}
            config={config}
            rotation={boardSetup.rotation}
          />
        </div>
        <TreasureDrawPile />
      </div>
    </section>
  );
};

const TREASURE_TOKENS = [1, 2, 3, 4, 5] as const;

// Per-layer offsets give the pile a hand-stacked feel.
const PILE_OFFSETS = [
  { rotate: -8, x: -3, y: 2 },
  { rotate: 5, x: 2, y: -1 },
  { rotate: -3, x: 0, y: 3 },
  { rotate: 6, x: -1, y: -2 },
  { rotate: 0, x: 0, y: 0 },
] as const;

const TreasureDrawPile = () => {
  const deck = useMemo(() => shuffle(TREASURE_TOKENS), []);
  return (
    <div className="relative w-28 h-28 shrink-0">
      {deck.map((id, i) => {
        const { rotate, x, y } = PILE_OFFSETS[i];
        return (
          <img
            key={id}
            src="/assets/room/tokens/feature_token_cover.png"
            alt="Treasure token"
            draggable={false}
            className="absolute inset-0 w-full h-full select-none"
            style={{
              transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)`,
              zIndex: i,
            }}
          />
        );
      })}
    </div>
  );
};

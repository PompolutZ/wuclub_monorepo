import { useMemo, useState, type PointerEvent } from "react";
import { shuffle } from "@/utils/functions";
import { boards } from "../../../../../shared/boards";
import { BoardOverlay, type BoardRotation } from "./BoardOverlay";
import { boardOverlayConfigs } from "./boardOverlayConfigs";
import {
  flipTreasure,
  placeTreasure,
  type BoardSetup,
  type Treasure,
} from "./roomStore";

type TreasuresStepProps = {
  roomId: string;
  boardSetup: BoardSetup;
  treasures: Treasure[];
};

type DragState = { id: number; x: number; y: number };

export const TreasuresStep = ({
  roomId,
  boardSetup,
  treasures,
}: TreasuresStepProps) => {
  const board = boards.find((b) => b.id === boardSetup.boardId);
  const config = board ? boardOverlayConfigs[board.id] : undefined;
  const deck = useMemo(() => shuffle(TREASURE_TOKENS), []);
  const [drag, setDrag] = useState<DragState | null>(null);

  if (!board) return null;

  const remaining = deck.filter((id) => !treasures.some((t) => t.id === id));

  const handlePointerDown = (e: PointerEvent<HTMLImageElement>, id: number) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ id, x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: PointerEvent<HTMLImageElement>) => {
    setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : null));
  };

  const handlePointerUp = (e: PointerEvent<HTMLImageElement>) => {
    if (!drag) return;
    const target = document.elementFromPoint(e.clientX, e.clientY);
    const polygon = target?.closest<SVGPolygonElement>("polygon[data-col]");
    if (polygon) {
      const col = Number(polygon.dataset.col);
      const row = Number(polygon.dataset.row);
      placeTreasure(roomId, { id: drag.id, col, row, faceUp: false });
    }
    setDrag(null);
  };

  const handleFlip = (id: number) => flipTreasure(roomId, id);

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
            placed={treasures}
            onFlip={handleFlip}
          />
        </div>
        <TreasureDrawPile
          deck={remaining}
          draggingId={drag?.id ?? null}
          rotation={boardSetup.rotation}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
      </div>
      {drag && (
        <img
          src="/assets/room/tokens/feature_token_cover.png"
          alt=""
          aria-hidden
          draggable={false}
          className="fixed top-0 left-0 w-28 h-28 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-50"
          style={{ left: drag.x, top: drag.y }}
        />
      )}
    </section>
  );
};

const TREASURE_TOKENS = [1, 2, 3, 4, 5] as const;

const PILE_OFFSETS = [
  { rotate: -8, x: -3, y: 2 },
  { rotate: 5, x: 2, y: -1 },
  { rotate: -3, x: 0, y: 3 },
  { rotate: 6, x: -1, y: -2 },
  { rotate: 0, x: 0, y: 0 },
] as const;

type TreasureDrawPileProps = {
  deck: number[];
  draggingId: number | null;
  rotation: BoardRotation;
  onPointerDown: (e: PointerEvent<HTMLImageElement>, id: number) => void;
  onPointerMove: (e: PointerEvent<HTMLImageElement>) => void;
  onPointerUp: (e: PointerEvent<HTMLImageElement>) => void;
};

const TreasureDrawPile = ({
  deck,
  draggingId,
  rotation,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: TreasureDrawPileProps) => {
  // Mod 180 so pile axis matches the board's hex axis (flat vs pointy)
  // without inverting token shadow at 180°/270°.
  const pileRotation = rotation % 180;
  return (
    <div
      className="relative w-28 h-28 shrink-0"
      style={{ transform: `rotate(${pileRotation}deg)` }}
    >
      {deck.map((id, i) => {
        const isTop = i === deck.length - 1;
        const isDragging = id === draggingId;
        const { rotate, x, y } = PILE_OFFSETS[i];
        return (
          <img
            key={id}
            src="/assets/room/tokens/feature_token_cover.png"
            alt="Treasure token"
            draggable={false}
            className="absolute inset-0 w-full h-full select-none"
            onPointerDown={isTop ? (e) => onPointerDown(e, id) : undefined}
            onPointerMove={isTop ? onPointerMove : undefined}
            onPointerUp={isTop ? onPointerUp : undefined}
            style={{
              transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)`,
              zIndex: i,
              cursor: isTop ? (isDragging ? "grabbing" : "grab") : "default",
              opacity: isDragging ? 0.3 : 1,
              touchAction: "none",
            }}
          />
        );
      })}
    </div>
  );
};

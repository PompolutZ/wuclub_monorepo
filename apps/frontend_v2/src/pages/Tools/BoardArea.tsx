import { type RefObject } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, RotateCw } from "lucide-react";
import { boards } from "../../../../../shared/boards";
import {
  BoardOverlay,
  type BoardRotation,
  type PlacedToken,
} from "../Room/BoardOverlay";
import { boardOverlayConfigs } from "../Room/boardOverlayConfigs";

type Props = {
  boardId: number;
  rotation: BoardRotation;
  modifying: boolean;
  placed: PlacedToken[];
  boardRef: RefObject<HTMLDivElement | null>;
  onPrevBoard: () => void;
  onNextBoard: () => void;
  onRotateCw: () => void;
  onRotateCcw: () => void;
};

export const BOARD_WIDTH = 600;

export const BoardArea = ({
  boardId,
  rotation,
  modifying,
  placed,
  boardRef,
  onPrevBoard,
  onNextBoard,
  onRotateCw,
  onRotateCcw,
}: Props) => {
  const board = boards.find((b) => b.id === boardId);
  if (!board) return null;
  const config = boardOverlayConfigs[board.id];

  return (
    <div
      ref={boardRef as RefObject<HTMLDivElement>}
      data-board-area
      className="relative"
      style={{ width: BOARD_WIDTH }}
    >
      <BoardOverlay
        board={board}
        config={config}
        rotation={rotation}
        placed={placed}
      />
      <p className="absolute left-1/2 -top-7 -translate-x-1/2 text-sm text-gray-700 whitespace-nowrap">
        <span className="font-semibold">{board.name}</span>
      </p>
      {modifying && (
        <>
          <div className="absolute top-1/2 -left-12 -translate-y-1/2">
            <RoundButton onClick={onPrevBoard} aria-label="Previous board">
              <ChevronLeft className="w-5 h-5" aria-hidden />
            </RoundButton>
          </div>
          <div className="absolute top-1/2 -right-12 -translate-y-1/2">
            <RoundButton onClick={onNextBoard} aria-label="Next board">
              <ChevronRight className="w-5 h-5" aria-hidden />
            </RoundButton>
          </div>
          <div className="absolute left-1/2 -bottom-12 -translate-x-1/2 flex items-center gap-3">
            <RoundButton
              onClick={onRotateCcw}
              aria-label="Rotate counter-clockwise"
            >
              <RotateCcw className="w-5 h-5" aria-hidden />
            </RoundButton>
            <RoundButton onClick={onRotateCw} aria-label="Rotate clockwise">
              <RotateCw className="w-5 h-5" aria-hidden />
            </RoundButton>
          </div>
        </>
      )}
    </div>
  );
};

const RoundButton = ({
  onClick,
  children,
  ...rest
}: {
  onClick: () => void;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    onClick={onClick}
    className="grid place-items-center w-9 h-9 rounded-full border border-gray-300 hover:bg-gray-100"
    {...rest}
  >
    {children}
  </button>
);

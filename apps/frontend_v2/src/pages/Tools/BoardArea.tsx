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
  onToggleModify: () => void;
};

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
  onToggleModify,
}: Props) => {
  const board = boards.find((b) => b.id === boardId);
  if (!board) return null;
  const config = boardOverlayConfigs[board.id];

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-gray-700">
        <span className="font-semibold">{board.name}</span>
      </p>
      <div className="flex items-center gap-3">
        {modifying && (
          <RoundButton onClick={onPrevBoard} aria-label="Previous board">
            <ChevronLeft className="w-5 h-5" aria-hidden />
          </RoundButton>
        )}
        <div
          ref={boardRef as RefObject<HTMLDivElement>}
          data-board-area
          className="relative w-[600px]"
        >
          <BoardOverlay
            board={board}
            config={config}
            rotation={rotation}
            placed={placed}
          />
        </div>
        {modifying && (
          <RoundButton onClick={onNextBoard} aria-label="Next board">
            <ChevronRight className="w-5 h-5" aria-hidden />
          </RoundButton>
        )}
      </div>
      <div className="flex items-center gap-3">
        {modifying && (
          <>
            <RoundButton
              onClick={onRotateCcw}
              aria-label="Rotate counter-clockwise"
            >
              <RotateCcw className="w-5 h-5" aria-hidden />
            </RoundButton>
            <RoundButton onClick={onRotateCw} aria-label="Rotate clockwise">
              <RotateCw className="w-5 h-5" aria-hidden />
            </RoundButton>
          </>
        )}
        <button
          type="button"
          onClick={onToggleModify}
          className="px-4 py-1.5 rounded border border-gray-300 text-sm font-medium hover:bg-gray-100"
        >
          {modifying ? "Save" : "Modify board"}
        </button>
      </div>
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

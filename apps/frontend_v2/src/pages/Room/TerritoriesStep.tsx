import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { boards } from "../../../../../shared/boards";
import { BoardOverlay, type BoardRotation } from "./BoardOverlay";
import { boardOverlayConfigs } from "./boardOverlayConfigs";
import { setBoardSetup } from "./roomStore";

type TerritoriesStepProps = {
  roomId: string;
};

export const TerritoriesStep = ({ roomId }: TerritoriesStepProps) => {
  // TODO: replace with selection driven by the priority winner.
  const [boardIndex, setBoardIndex] = useState(0);
  const [rotation, setRotation] = useState<BoardRotation>(0);

  const board = boards[boardIndex];
  const config = boardOverlayConfigs[board.id];

  const confirm = () => setBoardSetup(roomId, { boardId: board.id, rotation });

  const rotateCw = () => setRotation((r) => ((r + 90) % 360) as BoardRotation);
  const rotateCcw = () =>
    setRotation((r) => ((r + 270) % 360) as BoardRotation);

  const prevBoard = () =>
    setBoardIndex((i) => (i - 1 + boards.length) % boards.length);
  const nextBoard = () => setBoardIndex((i) => (i + 1) % boards.length);

  return (
    <section className="flex flex-col items-center space-y-4 max-w-4xl mx-auto w-full">
      <p className="text-sm text-gray-700 text-center">
        <span className="font-semibold">{board.name}</span>
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={rotateCcw}
          className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-100"
        >
          Rotate counter-clockwise
        </button>
        <button
          type="button"
          onClick={rotateCw}
          className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-100"
        >
          Rotate clockwise
        </button>
      </div>
      <div className="flex items-center justify-center gap-3 w-full">
        <button
          type="button"
          onClick={prevBoard}
          aria-label="Previous board"
          className="shrink-0 grid place-items-center w-9 h-9 rounded-full border border-gray-300 hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden />
        </button>
        <div className="relative w-full max-w-xl">
          <BoardOverlay board={board} config={config} rotation={rotation} />
        </div>
        <button
          type="button"
          onClick={nextBoard}
          aria-label="Next board"
          className="shrink-0 grid place-items-center w-9 h-9 rounded-full border border-gray-300 hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5" aria-hidden />
        </button>
      </div>
      <button
        type="button"
        onClick={confirm}
        className="px-4 py-2 rounded bg-purple-600 text-white text-sm font-medium hover:bg-purple-700"
      >
        Confirm board
      </button>
    </section>
  );
};

import { useState } from "react";
import { boards } from "../../../../../shared/boards";
import { BoardOverlay, type BoardRotation } from "./BoardOverlay";
import { boardOverlayConfigs } from "./boardOverlayConfigs";

type TerritoriesStepProps = {
  roomId: string;
};

export const TerritoriesStep = ({ roomId: _roomId }: TerritoriesStepProps) => {
  // TODO: replace with selection driven by the priority winner.
  const board = boards[0];
  const config = boardOverlayConfigs[board.id];
  const [rotation, setRotation] = useState<BoardRotation>(0);

  const rotateCw = () => setRotation((r) => ((r + 90) % 360) as BoardRotation);
  const rotateCcw = () =>
    setRotation((r) => ((r + 270) % 360) as BoardRotation);

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
      <div className="relative w-full max-w-xl">
        {config && (
          <BoardOverlay board={board} config={config} rotation={rotation} />
        )}
      </div>
    </section>
  );
};

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
      <div className="relative w-full max-w-xl">
        <BoardOverlay
          board={board}
          config={config}
          rotation={boardSetup.rotation}
        />
      </div>
    </section>
  );
};

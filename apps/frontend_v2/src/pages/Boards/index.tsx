import { BoardPicture } from "@components/BoardPicture";
import { ScrollContainer } from "@components/ScrollContainer";
import { boards } from "../../../../../shared/boards";

const BoardsPage = () => {
  return (
    <div className="flex-1 flex flex-col p-4">
      <ScrollContainer>
        <div className="flex flex-col space-y-8">
          {boards.map((board) => (
            <div className="space-y-2" key={board.id}>
              <h3 className="text-lg">{board.name}</h3>
              <BoardPicture board={board} imgClassName="max-w-2xl w-full" />
            </div>
          ))}
        </div>
      </ScrollContainer>
    </div>
  );
};

export default BoardsPage;

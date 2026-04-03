import { ScrollContainer } from "@components/ScrollContainer";
import { boards } from "../../../../../shared/boards";

const BoardPicture = ({ asset, name }: { asset: string; name: string }) => {
  const path = "../../assets/boards/" + asset;
  return (
    <picture>
      <source type="image/avif" srcSet={`${path}.avif`} />
      <source type="image/webp" srcSet={`${path}.webp`} />
      <img alt={name} src={`${path}.jpg`} className="max-w-2xl w-full" />
    </picture>
  );
};

const BoardsPage = () => {
  return (
    <div className="flex-1 flex flex-col p-4">
      <ScrollContainer>
        <div className="flex flex-col space-y-8">
          {boards.map((board) => (
            <div className="space-y-2" key={board.id}>
              <h3 className="text-lg">{board.name}</h3>
              <BoardPicture asset={board.asset} name={board.name} />
            </div>
          ))}
        </div>
      </ScrollContainer>
    </div>
  );
};

export default BoardsPage;

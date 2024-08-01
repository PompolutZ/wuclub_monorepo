import { useHistory, useParams } from "react-router-dom";
import { DeckPlayFormatToggle } from "@components/DeckPlayFormatToggle";
import { ACTIVE_FORMATS } from "../../data/wudb";
import { BOARDS_BASE } from "../../constants/routes";
import SectionTitle from "../../shared/components/SectionTitle";
import { Board, getBoardsValidForFormat } from "../../../../../shared/boards";
import { Format } from "@fxdxpz/schema";

interface BoardsRouteParams {
  format: Format;
}

const BoardPicture = ({ boardId, name }: { boardId: number; name: string }) => {
  const idx = `${boardId}`.padStart(2, "0");
  const filename = `BOARD${idx}`;
  const path = "/assets/boards/";
  return (
    <picture>
      <source type="image/avif" srcSet={`${path}${filename}.avif`} />
      <source type="image/webp" srcSet={`${path}${filename}.webp`} />
      <img alt={name} src={`${path}${filename}.jpg`} />
    </picture>
  );
};

const BoardsPage = () => {
  const { format } = useParams<BoardsRouteParams>();
  const history = useHistory();
  const boards =
    getBoardsValidForFormat(format)?.sort(
      (b1: Board, b2: Board) => b2.id - b1.id,
    ) ?? [];

  return (
    <div className="flex-1 p-4 lg:px-12 grid grid-cols-1 lg:grid-cols-5 gap-2">
      <div className="bg-gray-200 lg:p-4 flex flex-col space-y-4">
        <SectionTitle title="Boards" className="text-gray-700" />
        <DeckPlayFormatToggle
          selectedFormat={format}
          formats={ACTIVE_FORMATS}
          onFormatChange={(format) =>
            history.replace(`${BOARDS_BASE}/${format}`)
          }
        />
      </div>
      <section className="h-4 w-full col-span-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {boards.map(({ id, name, location }) => (
          <article className="flex flex-col space-y-2 p-4" key={name}>
            <h3 className="text-xl">{name}</h3>
            <BoardPicture boardId={id} name={name} />
            <p className="italic">
              <span className="font-bold">Location: </span>
              <span>{location}</span>
            </p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default BoardsPage;

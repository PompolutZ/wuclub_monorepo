import { Switch } from "@/components/ui/switch";
import { Format } from "@fxdxpz/schema";
import { useHistory, useParams } from "react-router-dom";
import {
  Board,
  getBoardsValidForFormat,
  getBoardValidFormats,
} from "../../../../../shared/boards";

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
  const boards = Object.entries(
    getBoardsValidForFormat(format.toUpperCase() as Format)
      .map((board) => ({
        ...board,
        location: board.locations.reverse().join(", "),
      }))
      .toSorted((b1: Board, b2: Board) => b2.id - b1.id)
      .reduce(
        (acc: Record<string, (Board & { location: string })[]>, board) => {
          if (acc[board.location]) {
            acc[board.location].push(board);
          } else {
            acc[board.location] = [board];
          }

          return acc;
        },
        {},
      ),
  );

  return (
    <div className="flex-1 p-4 flex flex-col space-y-4">
      <div className="flex space-x-2 items-center">
        <Switch
          onCheckedChange={() => {
            if (format.toUpperCase() !== "RELIC") {
              history.replace("/boards/relic");
            } else {
              history.replace("/boards/championship");
            }
          }}
        />
        <div className="text-sm">Show all boards </div>
      </div>
      <div className="flex flex-col space-y-8">
        {boards.map(([groupName, boards]) => (
          <section className="space-y-2" key={groupName}>
            <h1 className="text-xl font-bold border-b-slate-300 border-b">
              {groupName}
            </h1>
            <div className="flex flex-col space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0">
              {boards.map(({ id, name }) => (
                <article className="" key={name}>
                  <div>
                    <h3 className="text-lg">{name}</h3>
                    <h6 className="text-xs font-bold italic text-slate-600">
                      {getBoardValidFormats(id)
                        .map(
                          ([first, ...rest]) =>
                            first.toUpperCase() + rest.join("").toLowerCase(),
                        )
                        .join(", ")}
                    </h6>
                  </div>
                  <BoardPicture boardId={id} name={name} />
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default BoardsPage;

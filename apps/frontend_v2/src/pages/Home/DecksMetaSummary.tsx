import { FactionDeckPicture } from "@components/FactionDeckPicture";
import { DeckStat } from "@fxdxpz/schema";
import { Link } from "react-router-dom";

const DecksCount = ({ count }: { count: number }) => {
  if (count > 0) {
    return <span className="text-white text-2xl font-bold">{count}</span>;
  }

  return null;
};

function DeckMetaSummary({ faction, count }: DeckStat) {
  return (
    <div className="flex justify-center items-center p-6 group">
      <Link
        className="relative text-center bg-accent3-700 rounded w-full h-32 lg:w-32 text-6xl flex justify-end items-end p-2 transition-transform duration-200 transform group-hover:scale-105"
        to={`/decks/${faction}`}
      >
        <FactionDeckPicture
          size="large"
          className={`transform group-hover:scale-110 transition-transform duration-500 ease-out -top-[10%] -left-[10%] drop-shadow-md ${
            count > 0
              ? "w-24 h-24 absolute inset-0"
              : "w-24 h-24 top-1/2 left-1/2 absolute"
          }`}
          faction={faction}
        />

        <DecksCount count={count} />
      </Link>
    </div>
  );
}

export default DeckMetaSummary;

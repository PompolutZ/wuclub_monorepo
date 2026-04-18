import { getRouteApi, Link } from "@tanstack/react-router";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import { getRoom } from "./roomStore";

const route = getRouteApi("/room/$id");

const RoomPage = () => {
  const { id } = route.useParams();
  const isMobile = useBreakpoint("mobile");
  const room = getRoom(id);

  if (isMobile) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-center text-gray-700">
          Rooms are desktop-only for now.
        </p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
        <p className="text-gray-700">Room not found or expired.</p>
        <Link to="/mydecks" className="text-purple-700 underline">
          Back to My Decks
        </Link>
      </div>
    );
  }

  const { deck } = room;

  return (
    <div className="flex-1 flex flex-col p-6 space-y-4">
      <header>
        <p className="text-xs uppercase text-gray-500">Room</p>
        <h1 className="text-2xl font-bold break-all">{id}</h1>
      </header>

      <section className="space-y-1">
        <h2 className="text-lg font-semibold">Deck</h2>
        <p>
          {deck.name} <span className="text-gray-500">({deck.faction})</span>
        </p>
        <p className="text-sm text-gray-600">{deck.cards.length} cards</p>
      </section>
    </div>
  );
};

export default RoomPage;

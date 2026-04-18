import { getRouteApi, Link } from "@tanstack/react-router";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import { getRoom, type RoomPlayer } from "./roomStore";

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

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6">
      <header>
        <p className="text-xs uppercase text-gray-500">Room</p>
        <h1 className="text-2xl font-bold font-mono">{id}</h1>
      </header>

      <div className="grid grid-cols-2 gap-6">
        <PlayerCard role="Host" player={room.host} />
        <PlayerCard role="Guest" player={room.guest} />
      </div>
    </div>
  );
};

export default RoomPage;

const PlayerCard = ({
  role,
  player,
}: {
  role: string;
  player: RoomPlayer | null;
}) => {
  return (
    <section className="border rounded-md p-4 space-y-2">
      <h2 className="text-xs uppercase text-gray-500">{role}</h2>
      {player ? (
        <>
          <p className="font-semibold">{player.deck.name}</p>
          <p className="text-sm text-gray-600">{player.warband.displayName}</p>
          <p className="text-xs text-gray-500">
            {player.deck.cards.length} cards · hand {player.hand.length}
          </p>
        </>
      ) : (
        <p className="text-gray-400 italic">Waiting…</p>
      )}
    </section>
  );
};

import { lazy, Suspense } from "react";
import { getRouteApi, Link } from "@tanstack/react-router";
import { FactionPicture } from "@components/FactionDeckPicture";
import { FighterCardsPortal } from "@components/FighterCardsPortal";
import { CardPicture } from "@components/CardPicture";
import { LazyLoading } from "@/components/LazyLoading";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import { useRoom, type RoomPlayer } from "./roomStore";
import { SetupStepper } from "./SetupStepper";
import { WarbandStep } from "./WarbandStep";
import { DrawCardsStep } from "./DrawCardsStep";

const InitiativeStep = lazy(() =>
  import("./InitiativeStep").then((m) => ({ default: m.InitiativeStep })),
);

const route = getRouteApi("/room/$id");

const RoomPage = () => {
  const { id } = route.useParams();
  const isMobile = useBreakpoint("mobile");
  const room = useRoom(id);

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

      <SetupStepper current={room.setupStep} />

      {room.setupStep === "warband" ? (
        <WarbandStep roomId={id} current={room.host.warband} />
      ) : room.setupStep === "starting-hand" ? (
        <DrawCardsStep roomId={id} deckCards={room.host.deck.cards} />
      ) : room.setupStep === "initiative" ? (
        <Suspense fallback={<LazyLoading />}>
          <InitiativeStep roomId={id} rolls={room.initiativeRolls} />
        </Suspense>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <PlayerCard role="Host" player={room.host} />
          <PlayerCard role="Guest" player={room.host} mirror />
        </div>
      )}
    </div>
  );
};

export default RoomPage;

const PlayerCard = ({
  role,
  player,
  mirror,
}: {
  role: string;
  player: RoomPlayer | null;
  mirror?: boolean;
}) => {
  return (
    <section className="border rounded-md p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs uppercase text-gray-500">{role}</h2>
        {mirror && (
          <span className="text-[10px] uppercase text-gray-400">
            mirroring host
          </span>
        )}
      </div>
      {player ? (
        <>
          <div className="flex items-center gap-3">
            <FactionPicture faction={player.warband.name} size="w-12 h-12" />
            <div className="flex-1">
              <p className="font-semibold">{player.warband.displayName}</p>
              <p className="text-sm text-gray-600">{player.deck.name}</p>
              <FighterCardsPortal faction={player.warband.name} />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {player.deck.cards.length} cards · hand {player.hand.length}
          </p>
          {player.hand.length > 0 && <HandStrip hand={player.hand} />}
        </>
      ) : (
        <p className="text-gray-400 italic">Waiting…</p>
      )}
    </section>
  );
};

const HandStrip = ({ hand }: { hand: RoomPlayer["hand"] }) => {
  return (
    <div className="flex gap-2 overflow-x-auto py-2">
      {hand.map((card) => (
        <div key={card.id} className="shrink-0 w-28">
          <CardPicture card={card} />
        </div>
      ))}
    </div>
  );
};

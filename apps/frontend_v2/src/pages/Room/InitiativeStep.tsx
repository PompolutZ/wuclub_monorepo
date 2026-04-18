import { useEffect, useState } from "react";
import {
  advanceFromInitiative,
  setInitiativeRolls,
  type AttackFace,
  type InitiativeRolls,
} from "./roomStore";

// Roll-off precedence (2nd ed rulebook):
//   critical > swords > hammer > surrounded > flanked
// Equal faces tie — players roll off again.
const FACE_RANK: Record<AttackFace, number> = {
  critical: 4,
  swords: 3,
  hammer: 2,
  surrounded: 1,
  flanked: 0,
};

const ATTACK_FACES = Object.keys(FACE_RANK) as AttackFace[];

function toAttackFace(value: string | number | undefined): AttackFace | null {
  if (typeof value !== "string") return null;
  return ATTACK_FACES.includes(value as AttackFace)
    ? (value as AttackFace)
    : null;
}

type RollOffResult = "host" | "guest" | "tie" | null;

function rollOff(rolls: InitiativeRolls): RollOffResult {
  if (!rolls.host || !rolls.guest) return null;
  const diff = FACE_RANK[rolls.host] - FACE_RANK[rolls.guest];
  if (diff > 0) return "host";
  if (diff < 0) return "guest";
  return "tie";
}

type InitiativeStepProps = {
  roomId: string;
  rolls: InitiativeRolls;
};

export const InitiativeStep = ({ roomId, rolls }: InitiativeStepProps) => {
  const [rollingFor, setRollingFor] = useState<"host" | "guest" | null>(null);

  useEffect(() => {
    // Preload dice-box when the step mounts so the first click feels instant.
    import("@/services/diceBoxService").then((m) => m.preload());
  }, []);

  const result = rollOff(rolls);
  const isRolling = rollingFor !== null;
  const hasWinner = result === "host" || result === "guest";

  const handleRoll = async () => {
    const service = await import("@/services/diceBoxService");
    setRollingFor("host");
    const hostRolls = await service.rollOnce("1dattack");
    const hostFace = toAttackFace(hostRolls[0]?.value);
    setInitiativeRolls(roomId, { host: hostFace, guest: null });

    setRollingFor("guest");
    const guestRolls = await service.rollOnce("1dattack");
    const guestFace = toAttackFace(guestRolls[0]?.value);
    setInitiativeRolls(roomId, { host: hostFace, guest: guestFace });
    setRollingFor(null);
  };

  const rollButtonLabel = isRolling
    ? rollingFor === "host"
      ? "Rolling for host…"
      : "Rolling for guest…"
    : result === "tie"
      ? "Roll off again"
      : hasWinner
        ? "Rolled"
        : "Make initiative roll";

  return (
    <section className="flex flex-col items-center space-y-6 max-w-3xl mx-auto w-full">
      <p className="text-sm text-gray-700 text-center">
        Roll one attack die for each player. Highest face wins the roll-off:{" "}
        <span className="font-semibold">
          critical &gt; swords &gt; hammer &gt; surrounded &gt; flanked
        </span>
        . Ties roll again.
      </p>

      <button
        className="btn btn-purple cursor-pointer px-6 py-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isRolling || hasWinner}
        onClick={handleRoll}
      >
        {rollButtonLabel}
      </button>

      <div className="grid grid-cols-2 gap-6 w-full">
        <RollCard
          label="Host"
          face={rolls.host}
          active={rollingFor === "host"}
          winner={result === "host"}
        />
        <RollCard
          label="Guest"
          face={rolls.guest}
          active={rollingFor === "guest"}
          winner={result === "guest"}
        />
      </div>

      {result === "tie" && (
        <p className="text-sm text-purple-700 font-semibold">
          Tie — roll off again.
        </p>
      )}

      {hasWinner && (
        <>
          <p className="text-base font-semibold">
            {result === "host" ? "Host" : "Guest"} wins initiative.
          </p>
          <button
            className="btn btn-purple cursor-pointer px-6 py-2 font-bold"
            onClick={() => advanceFromInitiative(roomId)}
          >
            Accept and go to the next step
          </button>
        </>
      )}
    </section>
  );
};

const RollCard = ({
  label,
  face,
  active,
  winner,
}: {
  label: string;
  face: AttackFace | null;
  active: boolean;
  winner: boolean;
}) => {
  const ring = winner
    ? "ring-2 ring-green-500"
    : active
      ? "ring-2 ring-purple-500"
      : "";
  return (
    <div className={`border rounded-md p-4 space-y-1 ${ring}`}>
      <p className="text-xs uppercase text-gray-500">{label}</p>
      <p className="text-xl font-semibold capitalize">
        {face ?? (active ? "rolling…" : "—")}
      </p>
    </div>
  );
};

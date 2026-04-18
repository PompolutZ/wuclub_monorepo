import { useState } from "react";
import { factions, warbandsValidForOrganisedPlay } from "@fxdxpz/wudb";
import { WarbandPicker, type Warband } from "@components/WarbandPicker";
import { setHostWarband } from "./roomStore";

type WarbandStepProps = {
  roomId: string;
  current: Warband;
};

export const WarbandStep = ({ roomId, current }: WarbandStepProps) => {
  const pickable = warbandsValidForOrganisedPlay.filter((w) => w.id !== "u");
  const [selected, setSelected] = useState<Warband>(current);

  const hasPick = selected.id !== "u";

  const handleConfirm = () => {
    if (!hasPick) return;
    const f = factions[selected.id as keyof typeof factions];
    setHostWarband(roomId, f);
  };

  return (
    <section className="flex flex-col space-y-4 max-w-3xl mx-auto w-full flex-1">
      <p className="text-sm text-gray-700 text-center">
        Your deck is <span className="font-semibold">Universal</span> — pick a
        warband to play with before drawing your starting hand.
      </p>
      <WarbandPicker
        warbands={pickable}
        selected={selected}
        onSelect={setSelected}
      />
      <div className="flex-1" />
      <div className="flex justify-center pt-4">
        <button
          className="btn btn-purple cursor-pointer px-6 py-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!hasPick}
          onClick={handleConfirm}
        >
          Choose and go to the next step
        </button>
      </div>
    </section>
  );
};

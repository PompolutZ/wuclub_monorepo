import { animated as a, useSpring } from "@react-spring/web";
import { useEffect, useState } from "react";
import { factionMembers } from "../db/factionMembers";

function useClickAway() {
  const [clickedAway, setClickedAway] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el && el.nodeName !== "IMG") {
        setClickedAway(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setClickedAway(true);
      }
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return clickedAway;
}

export function FightersInfoList({ onClose, factionName }: { onClose?: () => void, factionName: keyof typeof factionMembers }) {
  const clickedAway = useClickAway();

  useEffect(() => {
    if (clickedAway && onClose) {
      onClose();
    }
  }, [clickedAway, onClose]);

  return (
    <div className="flex-1 relative">
      <div className="absolute inset-0 overflow-y-auto p-4 lg:p-12">
        {factionMembers[factionName].map((fighter: string, index: number) => (
          <FlippableFighterCard
            key={fighter}
            faction={factionName}
            index={index + 1}
          />
        ))}
      </div>
    </div>
  );
}

function FlippableFighterCard({ faction, index }: { faction: string, index: number }) {
  const [flipped, set] = useState(false);
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });
  return (
    <div
      className="grid px-4 sm:px-0 mb-4 lg:w-1/3 lg:mx-auto cursor-pointer"
      onClick={() => set((state) => !state)}
    >
      <a.picture
        className="w-full rounded-sm sm:w-3/4 row-start-1 col-start-1 sm:mx-auto cursor-pointer hover:shadow-lg"
        style={{
          opacity: opacity.to((o) => 1 - o),
          transform,
        }}
      >
        <source
          srcSet={`/assets/fighters/${faction}/${index}.webp`}
          type="image/webp"
        />
        <img src={`/assets/fighters/${faction}/${index}.png`} />
      </a.picture>
      <a.picture
        className="w-full rounded-sm sm:w-3/4 row-start-1 col-start-1 sm:mx-auto cursor-pointer hover:shadow-lg"
        style={{
          opacity,
          transform: transform.to((t) => `${t} rotateY(180deg)`),
        }}
      >
        <source
          srcSet={`/assets/fighters/${faction}/${index}-inspired.webp`}
          type="image/webp"
        />
        <img src={`/assets/fighters/${faction}/${index}-inspired.png`} />
      </a.picture>
    </div>
  );
}

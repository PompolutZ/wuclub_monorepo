import CloseIcon from "@icons/x.svg?react";
import { animated as a, useSpring } from "@react-spring/web";
import { useEffect, useState } from "react";
import { factionMembers } from "@fxdxpz/wudb";
import { ModalPresenter } from "../main";
import IconButton from "../shared/components/IconButton";
import { WarbandWarscroll } from "../shared/components/WarbandWarscroll";
import { useBreakpoint } from "@/hooks/useMediaQuery";

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

function ZoomedWarscroll({
  factionName,
  onClose,
}: {
  factionName: string;
  onClose: () => void;
}) {
  return (
    <ModalPresenter>
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative z-50 overflow-x-auto max-w-full p-4">
          <picture className="block" style={{ width: "150vw" }}>
            <source
              srcSet={`/assets/fighters/${factionName}/${factionName}-0.webp`}
              type="image/webp"
            />
            <img
              className="w-full"
              src={`/assets/fighters/${factionName}/${factionName}-0.png`}
              alt={`${factionName} warscroll`}
            />
          </picture>
        </div>
        <IconButton
          onClick={onClose}
          className="relative z-50 mt-4 rounded-full bg-white/90 w-11 h-11 grid place-content-center shadow-lg"
        >
          <CloseIcon />
        </IconButton>
      </div>
    </ModalPresenter>
  );
}

export default function FightersInfoList({
  onClose = undefined,
  factionName,
}: {
  onClose?: () => void;
  factionName: keyof typeof factionMembers;
}) {
  const clickedAway = useClickAway();
  const [zoomed, setZoomed] = useState(false);
  const isMobile = useBreakpoint("mobile");

  useEffect(() => {
    if (clickedAway && onClose) {
      onClose();
    }
  }, [clickedAway, onClose]);

  return (
    <div className="flex-1 relative">
      <div className="absolute inset-0 overflow-y-auto p-4 lg:p-12">
        <WarbandWarscroll
          className={`mb-4 mx-auto ${isMobile ? "cursor-pointer" : "lg:max-w-2xl"}`}
          factionName={factionName}
          onClick={isMobile ? () => setZoomed(true) : undefined}
        />
        <div className="flex flex-col lg:grid lg:grid-cols-3">
          {factionMembers[factionName].map((fighter, index) => (
            <FlippableFighterCard
              key={fighter}
              faction={factionName}
              index={index + 1}
            />
          ))}
        </div>
      </div>
      {zoomed && (
        <ZoomedWarscroll
          factionName={factionName}
          onClose={() => setZoomed(false)}
        />
      )}
    </div>
  );
}

function FlippableFighterCard({
  faction,
  index,
}: {
  faction: string;
  index: number;
}) {
  const [flipped, set] = useState(false);
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });
  return (
    <div
      className="grid px-2 sm:px-0 mb-4 cursor-pointer"
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
          srcSet={`/assets/fighters/${faction}/${faction}-${index}.webp`}
          type="image/webp"
        />
        <img src={`/assets/fighters/${faction}/${faction}-${index}.png`} />
      </a.picture>
      <a.picture
        className="w-full rounded-sm sm:w-3/4 row-start-1 col-start-1 sm:mx-auto cursor-pointer hover:shadow-lg"
        style={{
          opacity,
          transform: transform.to((t) => `${t} rotateY(180deg)`),
        }}
      >
        <source
          srcSet={`/assets/fighters/${faction}/${faction}-${index}-inspired.webp`}
          type="image/webp"
        />
        <img
          src={`/assets/fighters/${faction}/${faction}-${index}-inspired.png`}
        />
      </a.picture>
    </div>
  );
}

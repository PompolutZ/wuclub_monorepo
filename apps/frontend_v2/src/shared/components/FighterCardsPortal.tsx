import { animated, useSpring } from "@react-spring/web";
import { forwardRef, useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { factionMembers } from "../../data/wudb";
import { FactionName } from "../../data/wudb/types";
import { usePortal } from "../../hooks/usePortal";
import { FighterCard } from "./FighterCard";
import { Svgs } from "./Svgs";
import { WarbandWarscroll } from "./WarbandWarscroll";

type GenericFaction = Extract<
  FactionName,
  | "universal"
  | "grand-aliance-order"
  | "grand-aliance-chaos"
  | "grand-aliance-death"
  | "grand-aliance-destruction"
>;

const IsGenericFaction = (faction: FactionName): faction is GenericFaction =>
  [
    "universal",
    "grand-aliance-order",
    "grand-aliance-chaos",
    "grand-aliance-death",
    "grand-aliance-destruction",
  ].includes(faction);

export const FighterCardsPortal = ({ faction }: { faction: FactionName }) => {
  const { Portal, open, portalClickAwayRef } = usePortal();

  if (IsGenericFaction(faction)) {
    return null;
  }

  return (
    <div>
      <div className="flex space-x-2 items-center">
        <Svgs.WarbandIcon className="w-4 h-4 fill-purple-700" />
        <h3
          className="text-xs font-bold underline cursor-pointer"
          onClick={open}
        >
          Show fighter cards
        </h3>
      </div>

      <Portal>
        <div className="grid w-full h-full place-content-center bg-purple-100/25">
          <FighterCardsCarousel faction={faction} ref={portalClickAwayRef} />
        </div>
      </Portal>
    </div>
  );
};

const AnimatedFighterCard = animated(FighterCard);

const FlippableFighterCard = ({
  faction,
  index,
}: {
  faction: FactionName;
  index: number;
}) => {
  const [flipped, setFlipped] = useState(false);
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  return (
    <div
      className="grid grid-cols-1 grid-rows-1 cursor-pointer"
      onClick={() => setFlipped((prev) => !prev)}
    >
      <AnimatedFighterCard
        faction={faction}
        index={index}
        className="rounded-sm row-start-1 col-start-1 row-end-1 col-end-1 flex justify-center items-center"
        style={{
          opacity: opacity.to((o) => 1 - o),
          transform,
        }}
      />
      <AnimatedFighterCard
        faction={faction}
        index={index}
        className="rounded-sm row-start-1 col-start-1 row-end-1 col-end-1 flex justify-center items-center"
        isInspired
        style={{
          opacity,
          transform: transform.to((t) => `${t} rotateY(180deg)`),
        }}
      />
    </div>
  );
};

const FighterCardsCarousel = forwardRef<
  HTMLDivElement,
  { faction: FactionName }
>(function FighterCardsCarousel(
  { faction },
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const fighterCards = factionMembers[faction];

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div
      className="lg:w-[70vw] mx-auto"
      ref={ref}
    >
      <Carousel setApi={setApi}>
        <CarouselContent>
          <CarouselItem className="flex justify-center items-center">
            {/* Show warband warscroll */}
            <WarbandWarscroll factionName={faction} />
          </CarouselItem>
          {fighterCards.map((fighter, index) => (
            <CarouselItem key={fighter}>
              <FlippableFighterCard faction={faction} index={index + 1} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-center space-x-2 mt-2">
          <CarouselPrevious />
          <div className="py-2 text-center">
            Card {current} of {fighterCards.length + 1}
            <h6 className="text-xs italic text-gray-700">Tap card to flip</h6>
          </div>
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
});

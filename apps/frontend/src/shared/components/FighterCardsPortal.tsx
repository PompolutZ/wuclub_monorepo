import { forwardRef, useEffect, useState } from "react";
import { usePortal } from "../../hooks/usePortal";
import { Factions } from "@fxdxpz/schema";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { Svgs } from "./Svgs";
import { factionMembers } from "../../data/wudb";
import { factions } from "../../data/wudb/db";
import { FighterCard } from "./FighterCard";

type GenericFaction = Extract<
  Factions,
  | "universal"
  | "grand-aliance-order"
  | "grand-aliance-chaos"
  | "grand-aliance-death"
  | "grand-aliance-destruction"
>;

type Warband = Exclude<Factions, GenericFaction>;

const IsGenericFaction = (faction: Factions): faction is GenericFaction =>
  [
    "universal",
    "grand-aliance-order",
    "grand-aliance-chaos",
    "grand-aliance-death",
    "grand-aliance-destruction",
  ].includes(faction);

export const FighterCardsPortal = ({ faction }: { faction: Factions }) => {
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

const FighterCardsCarousel = forwardRef<HTMLDivElement, { faction: Warband }>(
  function PlotsCarousel({ faction }, ref: React.ForwardedRef<HTMLDivElement>) {
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
        className="flex flex-col items-center w-5/6 lg:w-72 mx-auto"
        ref={ref}
      >
        <Carousel setApi={setApi}>
          <CarouselContent>
            {fighterCards.map((fighter, index) => (
              <CarouselItem key={fighter}>
                <FighterCard faction={faction} index={index + 1} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <CarouselPrevious />
            <div className="py-2 text-center">
              Fighter {current} of {fighterCards.length}
              <h6 className="text-xs font-bold text-gray-900">
                Tap card to flip
              </h6>
            </div>
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    );
  },
);

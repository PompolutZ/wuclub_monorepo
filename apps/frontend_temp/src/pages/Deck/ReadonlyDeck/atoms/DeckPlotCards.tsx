import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Factions } from "@fxdxpz/schema";
import CompassIcon from "@icons/compass.svg?react";
import { checkDeckHasPlots, SetId } from "@wudb";
import { Set } from "@wudb/types";
import { forwardRef, useEffect, useState } from "react";
import { usePortal } from "../../../../hooks/usePortal";
import { PlotCard } from "../../../../shared/components/PlotCard";

type Props = {
  factionId: Factions;
  sets: SetId[];
};

export const DeckPlotCards = ({ factionId, sets }: Props) => {
  const { Portal, open, portalClickAwayRef } = usePortal();
  const setsWithPlots = checkDeckHasPlots(sets);

  return (
    <div>
      <div className="flex space-x-2 items-center">
        <CompassIcon className="w-4 h-4 stroke-purple-700" />
        <h3 className="text-xs font-bold">This deck includes plot cards:</h3>
      </div>
      <div className="space-x-1">
        {setsWithPlots.map(({ id, displayName }) => (
          <span
            className="underline hover:cursor-pointer"
            key={id}
            onClick={open}
          >
            {displayName}
          </span>
        ))}
      </div>

      <Portal>
        <div className="grid w-full h-full place-content-center bg-purple-100/25">
          <PlotsCarousel setsWithPlots={setsWithPlots} ref={portalClickAwayRef} />
        </div>
      </Portal>
    </div>
  );
};

const PlotsCarousel = forwardRef<HTMLDivElement, { setsWithPlots: Set[] }>(
  function PlotsCarousel(
    { setsWithPlots = [] },
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const sets = setsWithPlots.map((set) => set.id);

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
            {sets.map((set) => (
              <CarouselItem key={set}>
                <PlotCard set={set} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <CarouselPrevious />
            <div className="py-2 text-center">
              Card {current} of {sets.length}
            </div>
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    );
  },
);

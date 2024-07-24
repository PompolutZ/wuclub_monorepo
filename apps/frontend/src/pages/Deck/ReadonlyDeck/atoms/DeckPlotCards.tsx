import { getFactionByName, plots, setHasPlot, warbandHasPlot } from "@wudb";
import { usePortal } from "../../../../hooks/usePortal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { forwardRef, useEffect, useState } from "react";
import { Factions, Plot } from "@fxdxpz/schema";
import { type CarouselApi } from "@/components/ui/carousel";
import CompassIcon from "@icons/compass.svg?react";

type Props = {
  factionId: Factions;
  sets: number[];
};

export const DeckPlotCards = ({ factionId, sets }: Props) => {
  const { Portal, open, portalClickAwayRef } = usePortal();
  const plots = getPlotKeywords(factionId, sets);

  if (!checkDeckHasPlots(factionId, sets)) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="flex space-x-2 items-center">
        <CompassIcon className="w-4 h-4 stroke-purple-700" />
        <h3 className="text-xs font-bold">This deck includes plot cards:</h3>
      </div>
      <div className="space-x-1">
        {plots.map(({ keyword }) => (
          <span
            className="underline hover:cursor-pointer"
            key={keyword}
            onClick={open}
          >
            {keyword}
          </span>
        ))}
      </div>

      <Portal>
        <div className="grid w-full h-full place-content-center bg-purple-100/25">
          <PlotsCarousel plots={plots} ref={portalClickAwayRef} />
        </div>
      </Portal>
    </div>
  );
};

function checkDeckHasPlots(faction: Factions, sets: number[]) {
  return (
    warbandHasPlot(getFactionByName(faction)?.id) ||
    sets.some((setId) => setHasPlot(setId))
  );
}

function getPlotKeywords(faction: Factions, sets: number[]) {
  if (!checkDeckHasPlots(faction, sets)) return [];

  const plotInfos = Object.values(plots) as Plot[];

  return plotInfos.reduce((keywords: Plot[], plot: Plot) => {
    const factionWithPlot =
      plot.connection === "Warband" && plot.name === faction;
    const setWithPlot = plot.connection === "Set" && sets.includes(plot.id);

    return factionWithPlot || setWithPlot ? [...keywords, plot] : keywords;
  }, []);
}

const PlotsCarousel = forwardRef<HTMLDivElement, { plots: Plot[] }>(
  function PlotsCarousel(
    { plots = [] },
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const plotAssets = plots.flatMap((plot) =>
      plot.asset ? [plot.asset] : plot.cards?.map(({ asset }) => asset),
    );

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
            {plotAssets.map((asset) => (
              <CarouselItem key={asset}>
                <picture>
                  <img
                    src={`/assets/plots/${asset}.png`}
                    className="rounded-xl"
                  />
                </picture>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <CarouselPrevious />
            <div className="py-2 text-center">
              Card {current} of {plotAssets.length}
            </div>
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    );
  },
);

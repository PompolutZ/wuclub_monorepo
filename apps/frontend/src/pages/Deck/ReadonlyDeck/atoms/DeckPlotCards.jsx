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

const checkDeckHasPlots = (faction, sets) => {
  return (
    warbandHasPlot(getFactionByName(faction).id) ||
    sets.some((setId) => setHasPlot(setId))
  );
};

const getPlotKeywords = (faction, sets) => {
  if (!checkDeckHasPlots(faction, sets)) return [];

  const plotInfos = Object.values(plots);

  return plotInfos.reduce((keywords, plot) => {
    const factionWithPlot =
      plot.connection === "Warband" && plot.name === faction;
    const setWithPlot = plot.connection === "Set" && sets.includes(plot.id);

    return factionWithPlot || setWithPlot ? [...keywords, plot] : keywords;
  }, []);
};

export const DeckPlotCards = ({ factionId, sets }) => {
  const { Portal, open, portalClickAwayRef } = usePortal();
  const plots = getPlotKeywords(factionId, sets);

  return (
    <div className="flex items-center space-x-1">
      <span>This deck includes plot cards:</span>
      {plots.map(({ keyword }) => (
        <span
          className="font-bold underline hover:cursor-pointer"
          key={keyword}
          onClick={open}
        >
          {keyword}
        </span>
      ))}

      <Portal>
        <div className="grid w-full h-full place-content-center bg-purple-100/25">
          <PlotsCarousel plots={plots} ref={portalClickAwayRef} />
        </div>
      </Portal>
    </div>
  );
};

const PlotsCarousel = forwardRef(function PlotsCarousel({ plots = [] }, ref) {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const plotAssets = plots.flatMap((plot) =>
    plot.asset ? [plot.asset] : plot.cards.map(({ asset }) => asset),
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
    <div className="flex flex-col items-center" ref={ref}>
      <Carousel setApi={setApi} className="w-5/6 lg:w-full">
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
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="py-2 text-center">
        Card {current} of {plotAssets.length}
      </div>
    </div>
  );
});

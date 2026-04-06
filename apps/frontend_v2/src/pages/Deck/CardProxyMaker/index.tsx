import { factionMembers } from "@fxdxpz/wudb";
import { getCardPathByCardId } from "../../../utils/helpers";
import type { Card } from "@fxdxpz/wudb";
import { getPlotSetIds } from "./utils";
import { useProxySelection } from "./useProxySelection";
import { ProxyCardSection } from "./ProxyCardSection";
import { ProxyActionBar } from "./ProxyActionBar";

interface CardProxyMakerProps {
  cards?: Card[];
  factionId: string;
  onExit: () => void;
}

const cardImgClass = (selected: boolean) =>
  `w-full aspect-[64.5/89.9] object-cover cursor-pointer filter transition-all duration-150 ${
    selected ? "grayscale-0 drop-shadow-lg" : "grayscale"
  }`;

const CardProxyMaker = ({
  cards = [],
  factionId,
  onExit,
}: CardProxyMakerProps) => {
  const fighters = [
    ...((factionMembers as Record<string, readonly string[]>)[factionId] ?? []),
  ];
  const hasWarband = fighters.length > 0;
  const plotCards = getPlotSetIds([
    ...new Set(cards.map((card) => card.setId)),
  ]);

  const {
    selectedCardIds,
    selectedFighters,
    selectedPlotCards,
    selectedWarbandCard,
    handleDownload,
    toggleCard,
    toggleFighter,
    togglePlotCard,
    toggleWarbandCard,
    toggleAll,
    toggleWarband,
    togglePlotCards,
  } = useProxySelection({
    cards,
    factionId,
    fighters,
    plotCards,
    hasWarband,
    onExit,
  });

  return (
    <div className="fixed inset-0 z-10 p-8 backdrop-blur">
      <div className="flex w-full h-full flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {plotCards.length > 0 && (
            <ProxyCardSection
              title="Plot Cards"
              selected={selectedPlotCards.length}
              total={plotCards.length}
            >
              {plotCards.map((card: string) => (
                <img
                  id={`proxy ${card}`}
                  key={card}
                  src={`/assets/cards/${card}/${card}Plot.png`}
                  className={cardImgClass(selectedPlotCards.includes(card))}
                  onClick={togglePlotCard(card)}
                />
              ))}
            </ProxyCardSection>
          )}

          {hasWarband && (
            <section>
              <h3 className="text-sm font-bold text-gray-700 mb-2">
                Warband Card
              </h3>
              <img
                id="proxy warband-card"
                src={`/assets/fighters/${factionId}/${factionId}-0.png`}
                className={`w-1/2 md:w-1/3 aspect-[5.6/4.1] object-cover cursor-pointer filter transition-all duration-150 ${
                  selectedWarbandCard
                    ? "grayscale-0 drop-shadow-lg"
                    : "grayscale"
                }`}
                onClick={toggleWarbandCard}
              />
            </section>
          )}

          {hasWarband && (
            <ProxyCardSection
              title="Fighter Cards"
              selected={selectedFighters.length}
              total={fighters.length}
            >
              {fighters.map((fighter: string, index: number) => (
                <>
                  <img
                    id={`proxy ${fighter}`}
                    key={fighter}
                    src={`/assets/fighters/${factionId}/${factionId}-${index + 1}.png`}
                    className={cardImgClass(selectedFighters.includes(fighter))}
                    onClick={toggleFighter(fighter)}
                  />
                  <img
                    id={`proxy ${fighter}-inspired`}
                    key={`${fighter}-inspired`}
                    src={`/assets/fighters/${factionId}/${factionId}-${index + 1}-inspired.png`}
                    className={cardImgClass(selectedFighters.includes(fighter))}
                    onClick={toggleFighter(fighter)}
                  />
                </>
              ))}
            </ProxyCardSection>
          )}

          <ProxyCardSection
            title="Deck Cards"
            selected={selectedCardIds.length}
            total={cards.length}
          >
            {cards.map((card) => (
              <img
                id={`proxy ${card.id}`}
                key={card.id}
                src={getCardPathByCardId(card, "png")}
                className={cardImgClass(selectedCardIds.includes(card.id))}
                onClick={toggleCard(card.id)}
              />
            ))}
          </ProxyCardSection>
        </div>

        <ProxyActionBar
          selectedCardIds={selectedCardIds}
          totalCards={cards.length}
          selectedFighters={selectedFighters}
          totalFighters={fighters.length}
          hasWarband={hasWarband}
          selectedPlotCards={selectedPlotCards}
          totalPlotCards={plotCards.length}
          onDownload={handleDownload}
          onToggleAll={toggleAll}
          onToggleWarbandCard={toggleWarbandCard}
          selectedWarbandCard={selectedWarbandCard}
          onToggleWarband={toggleWarband}
          onTogglePlotCards={togglePlotCards}
          onExit={onExit}
        />
      </div>
    </div>
  );
};

export default CardProxyMaker;

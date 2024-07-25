import { Factions } from "@fxdxpz/schema";

type Props = {
  faction: Factions;
  isInspired?: boolean;
  index: number;
};

export const FighterCard = ({ faction, index, isInspired = false }: Props) => {
  const assetWithoutExtension = `/assets/fighters/${faction}/${index}${isInspired ? "-inspired" : ""}`;
  return (
    <picture>
      <source type="image/webp" srcSet={`${assetWithoutExtension}.webp`} />
      <img
        src={`${assetWithoutExtension}.png`}
        alt={`${faction} fighter ${index} ${isInspired ? "inspired side" : ""}`}
        className="rounded-xl"
      />
    </picture>
  );
};

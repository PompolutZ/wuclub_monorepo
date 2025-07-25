import { FactionName } from "../../data/wudb/types";

type Props = {
  faction: FactionName;
  isInspired?: boolean;
  index: number;
  style?: React.CSSProperties;
  className?: string;
};

export const FighterCard = ({
  faction,
  index,
  style,
  className,
  isInspired = false,
}: Props) => {
  const assetWithoutExtension = `/assets/fighters/${faction}/${faction}-${index}${isInspired ? "-inspired" : ""}`;
  return (
    <picture className={className} style={style}>
      <source type="image/webp" srcSet={`${assetWithoutExtension}.webp`} />
      <img
        src={`${assetWithoutExtension}.png`}
        alt={`${faction} fighter ${index} ${isInspired ? "inspired side" : ""}`}
        className="rounded-xl"
      />
    </picture>
  );
};

import { FactionName } from "@fxdxpz/wudb";

type Props = {
  faction: FactionName;
  fighter: string;
  isInspired?: boolean;
  style?: React.CSSProperties;
  className?: string;
};

export const FighterCard = ({
  faction,
  fighter,
  style,
  className,
  isInspired = false,
}: Props) => {
  const assetWithoutExtension = `/assets/fighters/${faction}/${faction}-${fighter}${isInspired ? "-inspired" : ""}`;
  return (
    <picture className={className} style={style}>
      <source type="image/webp" srcSet={`${assetWithoutExtension}.webp`} />
      <img
        src={`${assetWithoutExtension}.png`}
        alt={`${faction} ${fighter}${isInspired ? " inspired side" : ""}`}
        className="rounded-xl"
      />
    </picture>
  );
};

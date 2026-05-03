import { FactionName } from "@fxdxpz/wudb";

type Props = {
  faction: FactionName;
  isInspired?: boolean;
  // Either pass the slug (`fighter`) for name-based assets or the numeric
  // index for legacy `${faction}-${n}.png` files. `fighter` wins when both.
  fighter?: string;
  index?: number;
  style?: React.CSSProperties;
  className?: string;
};

export const FighterCard = ({
  faction,
  index,
  fighter,
  style,
  className,
  isInspired = false,
}: Props) => {
  const slug = fighter ?? String(index);
  const assetWithoutExtension = `/assets/fighters/${faction}/${faction}-${slug}${isInspired ? "-inspired" : ""}`;
  return (
    <picture className={className} style={style}>
      <source type="image/webp" srcSet={`${assetWithoutExtension}.webp`} />
      <img
        src={`${assetWithoutExtension}.png`}
        alt={`${faction} fighter ${slug}${isInspired ? " inspired side" : ""}`}
        className="rounded-xl"
      />
    </picture>
  );
};

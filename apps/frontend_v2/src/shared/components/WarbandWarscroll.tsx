import { FactionName } from "../../data/wudb/types";
import { twMerge } from "tailwind-merge";

type WarbandWarscrollProps = {
  factionName: FactionName;
  className?: string;
  onClick?: () => void;
};

export const WarbandWarscroll: React.FC<WarbandWarscrollProps> = ({
  factionName,
  className,
  onClick,
}) => {
  return (
    <picture
      className={twMerge("block w-[95vw] lg:w-5/6 mx-auto", className)}
      onClick={onClick}
    >
      <source
        srcSet={`/assets/fighters/${factionName}/${factionName}-0.webp`}
        type="image/webp"
      />
      <img
        className="w-full"
        src={`/assets/fighters/${factionName}/${factionName}-0.png`}
        alt={`${factionName} warscroll`}
      />
    </picture>
  );
};

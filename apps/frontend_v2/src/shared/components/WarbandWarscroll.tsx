import { FactionName } from "../../data/wudb/types";

export const WarbandWarscroll = ({
  factionName,
}: {
  factionName: FactionName;
}) => {
  return (
    <picture className="flex justify-center w-[95vw] lg:w-5/6">
      <source
        srcSet={`/assets/fighters/${factionName}/${factionName}-0.webp`}
        type="image/webp"
      />
      <img
        src={`/assets/fighters/${factionName}/${factionName}-0.png`}
        alt={`${factionName} warscroll`}
      />
    </picture>
  );
};

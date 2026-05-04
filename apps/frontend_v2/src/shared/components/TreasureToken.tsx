import type { ImgHTMLAttributes } from "react";
import { TokenPicture } from "./TokenPicture";

export const TREASURE_TOKEN_SCALE = 3.7;

export type TreasureFace = 1 | 2 | 3 | 4 | 5 | "cover";

type TreasureTokenProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  face: TreasureFace;
};

export const TreasureToken = ({ face, ...imgProps }: TreasureTokenProps) => {
  const name =
    face === "cover" ? "feature_token_cover" : `treasure_token_${face}`;
  return <TokenPicture src={`/assets/room/tokens/${name}`} {...imgProps} />;
};

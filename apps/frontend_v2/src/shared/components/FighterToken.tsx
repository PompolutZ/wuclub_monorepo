import type { ImgHTMLAttributes } from "react";
import { TokenPicture } from "./TokenPicture";

export const FIGHTER_TOKEN_SCALE = 1.5;

type FighterTokenProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  warband: string;
  fighter: string; // slug
};

export const FighterToken = ({
  warband,
  fighter,
  ...imgProps
}: FighterTokenProps) => {
  return (
    <TokenPicture
      src={`/assets/fighters/${warband}/${warband}-${fighter}-token`}
      {...imgProps}
    />
  );
};

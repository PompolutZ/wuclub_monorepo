import type { ImgHTMLAttributes } from "react";
import { TokenPicture } from "./TokenPicture";

export const FIGHTER_TOKEN_SCALE = 1.5;

type FighterTokenProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  warband: string;
  fighterIdx: number;
};

export const FighterToken = ({
  warband,
  fighterIdx,
  ...imgProps
}: FighterTokenProps) => {
  return (
    <TokenPicture
      src={`/assets/fighters/${warband}/${warband}-${fighterIdx}-token`}
      {...imgProps}
    />
  );
};

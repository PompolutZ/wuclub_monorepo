import type { ImgHTMLAttributes } from "react";
import { TokenPicture } from "./TokenPicture";

export const MARKER_TOKEN_SCALE = 0.4;

export const MARKER_KINDS = [
  "charge",
  "move",
  "guard",
  "stagger",
  "underdog",
  "generic_green",
  "generic_orange",
] as const;
export type MarkerKind = (typeof MARKER_KINDS)[number];

type MarkerTokenProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  kind: MarkerKind;
};

export const MarkerToken = ({ kind, ...imgProps }: MarkerTokenProps) => (
  <TokenPicture src={`/assets/room/tokens/token_${kind}`} {...imgProps} />
);

// Single source of truth for token visuals shared between Room and Tools.
// If a scale or asset path needs tuning, change it here — both pages pick it up.

export const TREASURE_TOKEN_SCALE = 3.7;
export const FIGHTER_TOKEN_SCALE = 1.5;

export const TREASURE_COVER_HREF =
  "/assets/room/tokens/feature_token_cover.png";

export function treasureFaceHref(treasureId: number): string {
  return `/assets/room/tokens/treasure_token_${treasureId}.png`;
}

export function fighterTokenHref(warband: string, fighterIdx: number): string {
  return `/assets/fighters/${warband}/${warband}-${fighterIdx}-token.png`;
}

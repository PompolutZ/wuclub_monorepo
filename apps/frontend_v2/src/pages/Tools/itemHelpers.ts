import {
  FIGHTER_TOKEN_SCALE,
  TREASURE_COVER_HREF,
  TREASURE_TOKEN_SCALE,
  fighterTokenHref,
  treasureFaceHref,
} from "@/shared/tokens";
import type { CanvasItem, CanvasItemKind } from "./types";

export function isTokenKind(kind: CanvasItemKind): boolean {
  return (
    kind === "treasure-cover" || kind === "treasure" || kind === "fighter-token"
  );
}

// Per-kind on-board scale. Tokens used by both Room and Tools pull their scale
// from @/shared/tokens, so any tuning happens in a single place.
export function boardScaleFor(kind: CanvasItemKind): number {
  switch (kind) {
    case "treasure-cover":
    case "treasure":
      return TREASURE_TOKEN_SCALE;
    case "fighter-token":
      return FIGHTER_TOKEN_SCALE;
    default:
      return 1;
  }
}

export function imageHrefFor(item: CanvasItem): string {
  switch (item.kind) {
    case "treasure-cover":
      return TREASURE_COVER_HREF;
    case "treasure":
      return treasureFaceHref(item.n);
    case "fighter-token":
      return fighterTokenHref(item.warband, item.fighterIdx);
    case "fighter-card":
      return `/assets/fighters/${item.warband}/${item.warband}-${item.fighterIdx}${item.isInspired ? "-inspired" : ""}.png`;
    case "warband-scroll":
      return `/assets/fighters/${item.warband}/${item.warband}-0.png`;
  }
}

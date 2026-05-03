import type { CanvasItemKind } from "./types";

export function isTokenKind(kind: CanvasItemKind): boolean {
  return (
    kind === "treasure-cover" || kind === "treasure" || kind === "fighter-token"
  );
}

import type { BoardRotation } from "../Room/BoardOverlay";

export type HexCoord = { col: number; row: number };
export type TreasureNumber = 1 | 2 | 3 | 4 | 5;

export type CanvasItem =
  | {
      kind: "treasure-cover";
      id: string;
      x: number;
      y: number;
      hex?: HexCoord;
    }
  | {
      kind: "treasure";
      id: string;
      n: TreasureNumber;
      x: number;
      y: number;
      hex?: HexCoord;
    }
  | {
      kind: "fighter-token";
      id: string;
      warband: string;
      fighterIdx: number;
      x: number;
      y: number;
      hex?: HexCoord;
    }
  | {
      kind: "fighter-card";
      id: string;
      warband: string;
      fighterIdx: number;
      isInspired: boolean;
      x: number;
      y: number;
    }
  | {
      kind: "warband-scroll";
      id: string;
      warband: string;
      x: number;
      y: number;
    };

export type CanvasItemKind = CanvasItem["kind"];

export type BoardSetting = {
  boardId: number;
  rotation: BoardRotation;
  modifying: boolean;
};

export type DragTemplate =
  | { kind: "treasure-cover" }
  | { kind: "treasure"; n: TreasureNumber }
  | { kind: "fighter-token"; warband: string; fighterIdx: number }
  | {
      kind: "fighter-card";
      warband: string;
      fighterIdx: number;
      isInspired: boolean;
    }
  | { kind: "warband-scroll"; warband: string };

export type DragState =
  | {
      source: "drawer";
      template: DragTemplate;
      clientX: number;
      clientY: number;
    }
  | {
      source: "canvas";
      itemId: string;
      offsetX: number;
      offsetY: number;
      clientX: number;
      clientY: number;
    };

export function isTokenKind(kind: CanvasItemKind): boolean {
  return (
    kind === "treasure-cover" || kind === "treasure" || kind === "fighter-token"
  );
}

export function imageHrefFor(item: CanvasItem): string {
  switch (item.kind) {
    case "treasure-cover":
      return "/assets/room/tokens/feature_token_cover.png";
    case "treasure":
      return `/assets/room/tokens/treasure_token_${item.n}.png`;
    case "fighter-token":
      return `/assets/fighters/${item.warband}/${item.warband}-${item.fighterIdx}-token.png`;
    case "fighter-card":
      return `/assets/fighters/${item.warband}/${item.warband}-${item.fighterIdx}${item.isInspired ? "-inspired" : ""}.png`;
    case "warband-scroll":
      return `/assets/fighters/${item.warband}/${item.warband}-0.png`;
  }
}

import type { MarkerKind } from "@components/MarkerToken";
import type { BoardRotation } from "../Room/BoardOverlay";

export type HexCoord = { col: number; row: number };
export type TreasureNumber = 1 | 2 | 3 | 4 | 5;

// Per-item multiplier of natural size, applied to both off-board pixel size
// and on-hex SVG sizing. Defaults to 1 at creation; can be overridden later
// per instance.
type Scaled = { scale: number };

export type CanvasItem =
  | (Scaled & {
      kind: "treasure-cover";
      id: string;
      x: number;
      y: number;
      hex?: HexCoord;
    })
  | (Scaled & {
      kind: "treasure";
      id: string;
      n: TreasureNumber;
      x: number;
      y: number;
      hex?: HexCoord;
    })
  | (Scaled & {
      kind: "fighter-token";
      id: string;
      warband: string;
      fighter: string;
      x: number;
      y: number;
      hex?: HexCoord;
    })
  | (Scaled & {
      kind: "marker";
      id: string;
      marker: MarkerKind;
      x: number;
      y: number;
      hex?: HexCoord;
    })
  | (Scaled & {
      kind: "fighter-card";
      id: string;
      warband: string;
      fighter: string;
      isInspired: boolean;
      x: number;
      y: number;
    })
  | (Scaled & {
      kind: "warband-scroll";
      id: string;
      warband: string;
      x: number;
      y: number;
    });

export type CanvasItemKind = CanvasItem["kind"];

export type BoardSetting = {
  boardId: number;
  rotation: BoardRotation;
  modifying: boolean;
};

export type DragTemplate =
  | { kind: "treasure-cover" }
  | { kind: "treasure"; n: TreasureNumber }
  | { kind: "fighter-token"; warband: string; fighter: string }
  | { kind: "marker"; marker: MarkerKind }
  | {
      kind: "fighter-card";
      warband: string;
      fighter: string;
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

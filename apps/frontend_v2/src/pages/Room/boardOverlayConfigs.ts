import { Orientation, type HexOffset } from "honeycomb-grid";

export type BoardOverlayConfig = {
  cols: number;
  rows: number;
  size: number; // hex radius, in board-image px
  gridOffset: { x: number; y: number };
  orientation: Orientation;
  hexOffset: HexOffset; // stagger direction: 1 | -1
  disabled: Set<string>; // overlay hexes with no underlying hex on the board image
};

// Underlying image dimensions for a 2nd-ed board.
export const BOARD_IMAGE_WIDTH = 1887;
export const BOARD_IMAGE_HEIGHT = 1730;

const baseConfig = {
  cols: 11,
  rows: 9,
  size: 110,
  gridOffset: { x: 9, y: 103 },
  orientation: Orientation.FLAT,
  hexOffset: 1 satisfies HexOffset,
} as const;

// Keyed by `Board.id`. Boards without a tuned config are absent.
export const boardOverlayConfigs: Partial<Record<number, BoardOverlayConfig>> =
  {
    1: {
      ...baseConfig,
      disabled: new Set([
        "0,0",
        "1,0",
        "9,0",
        "10,0",
        "0,7",
        "10,7",
        "0,8",
        "1,8",
        "2,8",
        "4,8",
        "6,8",
        "8,8",
        "9,8",
        "10,8",
      ]),
    },
  };

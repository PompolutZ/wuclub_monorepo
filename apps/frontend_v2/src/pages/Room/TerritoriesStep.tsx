import { useMemo } from "react";
import {
  defineHex,
  Grid,
  Orientation,
  rectangle,
  type HexOffset,
} from "honeycomb-grid";
import { boards } from "../../../../../shared/boards";

// Underlying image dimensions for a 2nd-ed board.
const BOARD_WIDTH = 1887;
const BOARD_HEIGHT = 1730;

type GridConfig = {
  cols: number;
  rows: number;
  size: number; // hex radius, in board-image px
  gridOffset: { x: number; y: number };
  orientation: Orientation;
  hexOffset: HexOffset; // stagger direction: 1 | -1
  disabled: Set<string>; // "col,row" offsets to skip
};

// Board placed horizontally → flat-top hexes.
const FLAT_CONFIG: GridConfig = {
  cols: 11,
  rows: 9,
  size: 110,
  gridOffset: { x: 9, y: 103 },
  orientation: Orientation.FLAT,
  hexOffset: 1,
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
};

// Board placed vertically (image rotated 90°) → pointy-top hexes.
// Placeholder values — tune offsets and disabled list for your image.
const POINTY_CONFIG: GridConfig = {
  cols: 9,
  rows: 11,
  size: 110,
  gridOffset: { x: 103, y: 9 },
  orientation: Orientation.POINTY,
  hexOffset: 1,
  disabled: new Set<string>([]),
};

// Flip this to tune the pointy map. When "pointy", the board image is
// rotated 90° inside the SVG so the overlay stays aligned.
const ACTIVE: "flat" | "pointy" = "flat";
const CONFIG = ACTIVE === "flat" ? FLAT_CONFIG : POINTY_CONFIG;

type TerritoriesStepProps = {
  roomId: string;
};

export const TerritoriesStep = ({ roomId: _roomId }: TerritoriesStepProps) => {
  const board = boards[0];
  const hexPath = useMemo(() => buildHexPath(CONFIG), []);

  const isPointy = CONFIG.orientation === Orientation.POINTY;
  const viewBoxW = isPointy ? BOARD_HEIGHT : BOARD_WIDTH;
  const viewBoxH = isPointy ? BOARD_WIDTH : BOARD_HEIGHT;
  // Rotate image 90° CW around (0,0), then shift back into the visible area.
  const imageTransform = isPointy
    ? `translate(${BOARD_HEIGHT} 0) rotate(90)`
    : undefined;

  return (
    <section className="flex flex-col items-center space-y-4 max-w-4xl mx-auto w-full">
      <p className="text-sm text-gray-700 text-center">
        Overlaying hex grid on{" "}
        <span className="font-semibold">{board.name}</span> (
        {ACTIVE === "flat" ? "flat-top" : "pointy-top"}).
      </p>
      <div className="relative w-full max-w-xl">
        <svg
          className="block w-full h-auto"
          viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <image
            href={`/assets/boards/${board.asset}.png`}
            width={BOARD_WIDTH}
            height={BOARD_HEIGHT}
            transform={imageTransform}
          />
          {hexPath.map((hex) => (
            <polygon
              key={`${hex.q},${hex.r}`}
              points={hex.points}
              fill="rgba(147, 51, 234, 0.2)"
              stroke="rgba(147, 51, 234, .5)"
              strokeWidth={2}
            />
          ))}
        </svg>
      </div>
    </section>
  );
};

type PaintedHex = {
  q: number;
  r: number;
  points: string;
};

function buildHexPath(config: GridConfig): PaintedHex[] {
  const Hex = defineHex({
    dimensions: config.size,
    orientation: config.orientation,
    origin: "topLeft",
    offset: config.hexOffset,
  });
  const grid = new Grid(
    Hex,
    rectangle({ width: config.cols, height: config.rows }),
  );
  const painted: PaintedHex[] = [];
  grid.forEach((hex) => {
    if (config.disabled.has(`${hex.col},${hex.row}`)) return;
    const points = hex.corners
      .map((c) => `${c.x + config.gridOffset.x},${c.y + config.gridOffset.y}`)
      .join(" ");
    painted.push({ q: hex.q, r: hex.r, points });
  });
  return painted;
}

import { useMemo, useState } from "react";
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

type GridConfingBase = {
  cols: number;
  rows: number;
  size: number; // hex radius, in board-image px
  gridOffset: { x: number; y: number };
  orientation: Orientation;
  hexOffset: HexOffset; // stagger direction: 1 | -1
};

type GridConfig = GridConfingBase & {
  disabled: Set<string>; // overlay hexes that do not have underlying hex on the board image.
};

const baseConfig: GridConfingBase = {
  cols: 11,
  rows: 9,
  size: 110,
  gridOffset: { x: 9, y: 103 },
  orientation: Orientation.FLAT,
  hexOffset: 1,
};

// Board placed horizontally → flat-top hexes.
const FLAT_CONFIG: GridConfig = {
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
};

// Board placed vertically (image rotated 90°) → pointy-top hexes.
// Placeholder values — tune offsets and disabled list for your image.
// maybe we won't need this after all, if everything will be just based on transform
const POINTY_CONFIG: GridConfig = {
  ...baseConfig,
  disabled: new Set<string>([
    "0,0",
    "0,1",
    "0,9",
    "0,10",
    "7,0",
    "8,0",
    "8,1",
    "8,2",
    "8,4",
    "8,6",
    "8,8",
    "8,9",
    "8,10",
    "7,10",
  ]),
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
  const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(0);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const isPointy = CONFIG.orientation === Orientation.POINTY;
  const baseW = isPointy ? BOARD_HEIGHT : BOARD_WIDTH;
  const baseH = isPointy ? BOARD_WIDTH : BOARD_HEIGHT;
  const isQuarterTurn = rotation === 90 || rotation === 270;
  const viewBoxW = isQuarterTurn ? baseH : baseW;
  const viewBoxH = isQuarterTurn ? baseW : baseH;

  const imageTransform = isPointy
    ? `translate(${BOARD_HEIGHT} 0) rotate(90)`
    : undefined;

  const rotationTransform = (() => {
    switch (rotation) {
      case 90:
        return `translate(${baseH} 0) rotate(90)`;
      case 180:
        return `translate(${baseW} ${baseH}) rotate(180)`;
      case 270:
        return `translate(0 ${baseW}) rotate(-90)`;
      default:
        return undefined;
    }
  })();

  const rotateCw = () =>
    setRotation((r) => ((r + 90) % 360) as 0 | 90 | 180 | 270);
  const rotateCcw = () =>
    setRotation((r) => ((r + 270) % 360) as 0 | 90 | 180 | 270);

  return (
    <section className="flex flex-col items-center space-y-4 max-w-4xl mx-auto w-full">
      <p className="text-sm text-gray-700 text-center">
        Overlaying hex grid on{" "}
        <span className="font-semibold">{board.name}</span> (
        {ACTIVE === "flat" ? "flat-top" : "pointy-top"}).
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={rotateCcw}
          className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-100"
        >
          Rotate counter-clockwise
        </button>
        <button
          type="button"
          onClick={rotateCw}
          className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-100"
        >
          Rotate clockwise
        </button>
      </div>
      <div className="relative w-full max-w-xl">
        <svg
          className="block w-full h-auto"
          viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <g transform={rotationTransform}>
            <image
              href={`/assets/boards/${board.asset}.png`}
              width={BOARD_WIDTH}
              height={BOARD_HEIGHT}
              transform={imageTransform}
            />
            {hexPath.map((hex) => {
              const key = `${hex.col},${hex.row}`;
              const isHovered = hoveredKey === key;
              return (
                <g key={key}>
                  <polygon
                    points={hex.points}
                    fill={
                      isHovered
                        ? "rgba(147, 51, 234, 0.55)"
                        : "rgba(147, 51, 234, 0.2)"
                    }
                    stroke="rgba(147, 51, 234, .5)"
                    strokeWidth={2}
                    onMouseEnter={() => setHoveredKey(key)}
                    onMouseLeave={() =>
                      setHoveredKey((prev) => (prev === key ? null : prev))
                    }
                  />
                  {isHovered && (
                    <text
                      x={hex.cx}
                      y={hex.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={48}
                      fontWeight="bold"
                      fill="white"
                      pointerEvents="none"
                      transform={`rotate(${-rotation} ${hex.cx} ${hex.cy})`}
                    >
                      {key}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </section>
  );
};

type PaintedHex = {
  q: number;
  r: number;
  col: number;
  row: number;
  cx: number;
  cy: number;
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
    painted.push({
      q: hex.q,
      r: hex.r,
      col: hex.col,
      row: hex.row,
      cx: hex.x + config.gridOffset.x,
      cy: hex.y + config.gridOffset.y,
      points,
    });
  });
  return painted;
}

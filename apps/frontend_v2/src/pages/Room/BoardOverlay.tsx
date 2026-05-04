import { useMemo, useState, type ReactNode } from "react";
import { defineHex, Grid, rectangle } from "honeycomb-grid";
import { BoardPicture } from "@components/BoardPicture";
import type { Board } from "../../../../../shared/boards";
import {
  BOARD_IMAGE_HEIGHT,
  BOARD_IMAGE_WIDTH,
  type BoardOverlayConfig,
} from "./boardOverlayConfigs";

export type BoardRotation = 0 | 90 | 180 | 270;

// Stacking order of token layers, bottom to top. New layers go here.
export const BOARD_LAYERS = ["feature", "fighter", "marker"] as const;
export type BoardLayer = (typeof BOARD_LAYERS)[number];

export type PlacedToken = {
  id: string | number;
  col: number;
  row: number;
  // Multiplier of hex radius — the foreignObject is sized to (config.size * scale).
  scale: number;
  // Pre-rendered token (e.g. <TreasureToken/> or <FighterToken/>). The caller
  // owns asset path + naming; BoardOverlay only positions and sizes it.
  content: ReactNode;
  layer: BoardLayer;
};

type BoardOverlayProps = {
  board: Board;
  config?: BoardOverlayConfig;
  rotation: BoardRotation;
  placed?: PlacedToken[];
  onHexClick?: (col: number, row: number) => void;
};

export const BoardOverlay = ({
  board,
  config,
  rotation,
  placed,
  onHexClick,
}: BoardOverlayProps) => {
  const hexPath = useMemo(() => (config ? buildHexPath(config) : []), [config]);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const isQuarterTurn = rotation === 90 || rotation === 270;
  const viewBoxW = isQuarterTurn ? BOARD_IMAGE_HEIGHT : BOARD_IMAGE_WIDTH;
  const viewBoxH = isQuarterTurn ? BOARD_IMAGE_WIDTH : BOARD_IMAGE_HEIGHT;

  const rotationTransform = (() => {
    switch (rotation) {
      case 90:
        return `translate(${BOARD_IMAGE_HEIGHT} 0) rotate(90)`;
      case 180:
        return `translate(${BOARD_IMAGE_WIDTH} ${BOARD_IMAGE_HEIGHT}) rotate(180)`;
      case 270:
        return `translate(0 ${BOARD_IMAGE_WIDTH}) rotate(-90)`;
      default:
        return undefined;
    }
  })();

  return (
    <svg
      className="block w-full h-auto"
      viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform={rotationTransform}>
        <foreignObject
          x={0}
          y={0}
          width={BOARD_IMAGE_WIDTH}
          height={BOARD_IMAGE_HEIGHT}
        >
          <BoardPicture board={board} imgClassName="block w-full h-full" />
        </foreignObject>
        {config &&
          BOARD_LAYERS.map((layer) => (
            <g key={layer} data-layer={layer}>
              {placed
                ?.filter((p) => p.layer === layer)
                .map((p) => {
                  const hex = hexPath.find(
                    (h) => h.col === p.col && h.row === p.row,
                  );
                  if (!hex) return null;
                  const size = config.size * p.scale;
                  return (
                    <foreignObject
                      key={p.id}
                      x={hex.cx - size / 2}
                      y={hex.cy - size / 2}
                      width={size}
                      height={size}
                      style={{ pointerEvents: "none" }}
                    >
                      {p.content}
                    </foreignObject>
                  );
                })}
            </g>
          ))}
        {hexPath.map((hex) => (
          <HexCell
            key={`${hex.col},${hex.row}`}
            hex={hex}
            isHovered={hoveredKey === `${hex.col},${hex.row}`}
            rotation={rotation}
            onHoverChange={setHoveredKey}
            onClick={onHexClick}
          />
        ))}
      </g>
    </svg>
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

type HexCellProps = {
  hex: PaintedHex;
  isHovered: boolean;
  rotation: BoardRotation;
  onHoverChange: (key: string | null) => void;
  onClick?: (col: number, row: number) => void;
};

const HexCell = ({
  hex,
  isHovered,
  rotation,
  onHoverChange,
  onClick,
}: HexCellProps) => {
  const key = `${hex.col},${hex.row}`;
  return (
    <g>
      <polygon
        points={hex.points}
        data-col={hex.col}
        data-row={hex.row}
        fill={
          isHovered ? "rgba(147, 51, 234, 0.55)" : "rgba(147, 51, 234, 0.2)"
        }
        stroke="rgba(147, 51, 234, .5)"
        strokeWidth={2}
        style={{ cursor: onClick ? "pointer" : undefined }}
        onMouseEnter={() => onHoverChange(key)}
        onMouseLeave={() => onHoverChange(null)}
        onClick={onClick ? () => onClick(hex.col, hex.row) : undefined}
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
};

function buildHexPath(config: BoardOverlayConfig): PaintedHex[] {
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

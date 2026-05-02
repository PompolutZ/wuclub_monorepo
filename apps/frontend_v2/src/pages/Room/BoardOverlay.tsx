import { useMemo, useState } from "react";
import { defineHex, Grid, rectangle } from "honeycomb-grid";
import { BoardPicture } from "@components/BoardPicture";
import type { Board } from "../../../../../shared/boards";
import {
  BOARD_IMAGE_HEIGHT,
  BOARD_IMAGE_WIDTH,
  type BoardOverlayConfig,
} from "./boardOverlayConfigs";

export type BoardRotation = 0 | 90 | 180 | 270;

export type PlacedToken = {
  id: number;
  col: number;
  row: number;
  faceUp: boolean;
};

type BoardOverlayProps = {
  board: Board;
  config?: BoardOverlayConfig;
  rotation: BoardRotation;
  placed?: PlacedToken[];
  onFlip?: (id: number) => void;
};

// Token image has padding around its hex shape; this multiplier on
// the hex radius makes the visible token roughly fill the board hex.
const PLACED_TOKEN_SCALE = 3.7;

export const BoardOverlay = ({
  board,
  config,
  rotation,
  placed,
  onFlip,
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
        {hexPath.map((hex) => (
          <HexCell
            key={`${hex.col},${hex.row}`}
            hex={hex}
            isHovered={hoveredKey === `${hex.col},${hex.row}`}
            rotation={rotation}
            onHoverChange={setHoveredKey}
          />
        ))}
        {config &&
          placed?.map((p) => {
            const hex = hexPath.find((h) => h.col === p.col && h.row === p.row);
            if (!hex) return null;
            const size = config.size * PLACED_TOKEN_SCALE;
            const href = p.faceUp
              ? `/assets/room/tokens/treasure_token_${p.id}.png`
              : "/assets/room/tokens/feature_token_cover.png";
            return (
              <image
                key={p.id}
                href={href}
                x={hex.cx - size / 2}
                y={hex.cy - size / 2}
                width={size}
                height={size}
                onClick={onFlip ? () => onFlip(p.id) : undefined}
                style={{
                  pointerEvents: onFlip ? "auto" : "none",
                  cursor: onFlip ? "pointer" : undefined,
                }}
              />
            );
          })}
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
};

const HexCell = ({ hex, isHovered, rotation, onHoverChange }: HexCellProps) => {
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
        onMouseEnter={() => onHoverChange(key)}
        onMouseLeave={() => onHoverChange(null)}
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

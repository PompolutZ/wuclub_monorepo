import { FighterCard } from "@components/FighterCard";
import { FighterToken } from "@components/FighterToken";
import { MarkerToken } from "@components/MarkerToken";
import { TreasureToken } from "@components/TreasureToken";
import type { FactionName } from "@fxdxpz/wudb";
import type { PointerEvent as ReactPointerEvent } from "react";
import { BOARD_IMAGE_WIDTH } from "../Room/boardOverlayConfigs";
import { BOARD_WIDTH } from "./BoardArea";
import type { CanvasItem } from "./types";

// World scale: pixels-per-natural-image-pixel, so every asset stays in
// real-world proportion to the rendered board. `item.scale` multiplies on top.
const WORLD_SCALE = BOARD_WIDTH / BOARD_IMAGE_WIDTH;

// Natural source image dimensions (px). Sizes are derived so e.g. a 300×420
// fighter card visually relates to a 1887×1730 board the same way it does in
// real life.
const NATURAL_IMAGE_SIZE: Record<CanvasItem["kind"], number> = {
  "treasure-cover": 412,
  treasure: 412,
  "fighter-token": 170,
  marker: 75,
  "fighter-card": 300,
  "warband-scroll": 810,
};

const NATURAL_SIZE: Record<CanvasItem["kind"], number> = Object.fromEntries(
  Object.entries(NATURAL_IMAGE_SIZE).map(([k, v]) => [k, v * WORLD_SCALE]),
) as Record<CanvasItem["kind"], number>;

type Props = {
  item: CanvasItem;
  isDragging: boolean;
  position?: "fixed" | "absolute";
  // CSS transform scale applied for ghosts in viewport space so they visually
  // match the canvas zoom while following the cursor. Distinct from
  // `item.scale`, which is the per-instance natural-size multiplier.
  zoomScale?: number;
  dimmed?: boolean;
  selected?: boolean;
  onPointerDown: (e: ReactPointerEvent<HTMLElement>, id: string) => void;
};

const SELECTED_FILTER = "drop-shadow(0 0 6px rgba(147, 51, 234, 0.95))";

export const CanvasItemView = ({
  item,
  isDragging,
  position = "fixed",
  zoomScale = 1,
  dimmed = false,
  selected = false,
  onPointerDown,
}: Props) => {
  const filter =
    dimmed && !isDragging
      ? "grayscale(1)"
      : selected && !isDragging
        ? SELECTED_FILTER
        : undefined;
  const baseStyle: React.CSSProperties = {
    position,
    left: item.x,
    top: item.y,
    transform: `translate(-50%, -50%) scale(${zoomScale})`,
    cursor: isDragging ? "grabbing" : "grab",
    opacity: isDragging ? 0.3 : dimmed ? 0.4 : 1,
    filter,
    touchAction: "none",
    userSelect: "none",
    pointerEvents: isDragging ? "none" : "auto",
  };

  const size = NATURAL_SIZE[item.kind] * item.scale;

  if (item.kind === "treasure-cover") {
    return (
      <TreasureToken
        data-canvas-item=""
        face="cover"
        draggable={false}
        width={size}
        height={size}
        onPointerDown={(e) => onPointerDown(e, item.id)}
        style={baseStyle}
      />
    );
  }

  if (item.kind === "treasure") {
    return (
      <TreasureToken
        data-canvas-item=""
        face={item.n}
        draggable={false}
        width={size}
        height={size}
        onPointerDown={(e) => onPointerDown(e, item.id)}
        style={baseStyle}
      />
    );
  }

  if (item.kind === "fighter-token") {
    return (
      <FighterToken
        data-canvas-item=""
        warband={item.warband}
        fighter={item.fighter}
        draggable={false}
        width={size}
        height={size}
        onPointerDown={(e) => onPointerDown(e, item.id)}
        style={baseStyle}
      />
    );
  }

  if (item.kind === "marker") {
    return (
      <MarkerToken
        data-canvas-item=""
        kind={item.marker}
        draggable={false}
        width={size}
        height={size}
        onPointerDown={(e) => onPointerDown(e, item.id)}
        style={{ ...baseStyle, zIndex: 20 }}
      />
    );
  }

  if (item.kind === "fighter-card") {
    return (
      <div
        data-canvas-item=""
        onPointerDown={(e) => onPointerDown(e, item.id)}
        style={{ ...baseStyle, width: size }}
      >
        <FighterCard
          faction={item.warband as FactionName}
          fighter={item.fighter}
          isInspired={item.isInspired}
          className="block w-full pointer-events-none"
        />
      </div>
    );
  }

  return (
    <div
      data-canvas-item=""
      onPointerDown={(e) => onPointerDown(e, item.id)}
      style={{ ...baseStyle, width: size }}
    >
      <picture className="block w-full pointer-events-none">
        <source
          type="image/webp"
          srcSet={`/assets/fighters/${item.warband}/${item.warband}-warscroll.webp`}
        />
        <img
          src={`/assets/fighters/${item.warband}/${item.warband}-warscroll.png`}
          alt={`${item.warband} warscroll`}
        />
      </picture>
    </div>
  );
};

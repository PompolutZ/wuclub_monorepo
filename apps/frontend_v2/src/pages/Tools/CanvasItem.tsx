import { FighterCard } from "@components/FighterCard";
import { FighterToken } from "@components/FighterToken";
import { MARKER_TOKEN_SCALE, MarkerToken } from "@components/MarkerToken";
import { TreasureToken } from "@components/TreasureToken";
import type { FactionName } from "@fxdxpz/wudb";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { CanvasItem } from "./types";

const TOKEN_SIZE = 80;
const MARKER_SIZE = TOKEN_SIZE * MARKER_TOKEN_SCALE;
const CARD_WIDTH = 220;
const SCROLL_WIDTH = 360;

type Props = {
  item: CanvasItem;
  isDragging: boolean;
  position?: "fixed" | "absolute";
  scale?: number;
  dimmed?: boolean;
  onPointerDown: (e: ReactPointerEvent<HTMLElement>, id: string) => void;
};

export const CanvasItemView = ({
  item,
  isDragging,
  position = "fixed",
  scale = 1,
  dimmed = false,
  onPointerDown,
}: Props) => {
  const baseStyle: React.CSSProperties = {
    position,
    left: item.x,
    top: item.y,
    transform: `translate(-50%, -50%) scale(${scale})`,
    cursor: isDragging ? "grabbing" : "grab",
    opacity: isDragging ? 0.3 : dimmed ? 0.4 : 1,
    filter: dimmed && !isDragging ? "grayscale(1)" : undefined,
    touchAction: "none",
    userSelect: "none",
    pointerEvents: isDragging ? "none" : "auto",
  };

  if (item.kind === "treasure-cover") {
    return (
      <TreasureToken
        face="cover"
        draggable={false}
        width={TOKEN_SIZE}
        height={TOKEN_SIZE}
        onPointerDown={(e) => onPointerDown(e, item.id)}
        style={baseStyle}
      />
    );
  }

  if (item.kind === "treasure") {
    return (
      <TreasureToken
        face={item.n}
        draggable={false}
        width={TOKEN_SIZE}
        height={TOKEN_SIZE}
        onPointerDown={(e) => onPointerDown(e, item.id)}
        style={baseStyle}
      />
    );
  }

  if (item.kind === "fighter-token") {
    return (
      <FighterToken
        warband={item.warband}
        fighter={item.fighter}
        draggable={false}
        width={TOKEN_SIZE}
        height={TOKEN_SIZE}
        onPointerDown={(e) => onPointerDown(e, item.id)}
        style={baseStyle}
      />
    );
  }

  if (item.kind === "marker") {
    return (
      <MarkerToken
        kind={item.marker}
        draggable={false}
        width={MARKER_SIZE}
        height={MARKER_SIZE}
        onPointerDown={(e) => onPointerDown(e, item.id)}
        style={{ ...baseStyle, zIndex: 20 }}
      />
    );
  }

  if (item.kind === "fighter-card") {
    return (
      <div
        onPointerDown={(e) => onPointerDown(e, item.id)}
        style={{ ...baseStyle, width: CARD_WIDTH }}
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
      onPointerDown={(e) => onPointerDown(e, item.id)}
      style={{ ...baseStyle, width: SCROLL_WIDTH }}
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

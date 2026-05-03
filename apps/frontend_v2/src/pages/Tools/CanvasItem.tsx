import { FighterCard } from "@components/FighterCard";
import type { FactionName } from "@fxdxpz/wudb";
import type { PointerEvent as ReactPointerEvent } from "react";
import { imageHrefFor, type CanvasItem } from "./types";

const TOKEN_SIZE = 80;
const CARD_WIDTH = 220;
const SCROLL_WIDTH = 360;

type Props = {
  item: CanvasItem;
  isDragging: boolean;
  onPointerDown: (e: ReactPointerEvent<HTMLElement>, id: string) => void;
};

export const CanvasItemView = ({ item, isDragging, onPointerDown }: Props) => {
  const baseStyle: React.CSSProperties = {
    position: "fixed",
    left: item.x,
    top: item.y,
    transform: "translate(-50%, -50%)",
    cursor: isDragging ? "grabbing" : "grab",
    opacity: isDragging ? 0.3 : 1,
    touchAction: "none",
    userSelect: "none",
  };

  if (
    item.kind === "treasure-cover" ||
    item.kind === "treasure" ||
    item.kind === "fighter-token"
  ) {
    return (
      <img
        src={imageHrefFor(item)}
        alt=""
        draggable={false}
        width={TOKEN_SIZE}
        height={TOKEN_SIZE}
        onPointerDown={(e) => onPointerDown(e, item.id)}
        style={baseStyle}
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
          index={item.fighterIdx}
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
          srcSet={`/assets/fighters/${item.warband}/${item.warband}-0.webp`}
        />
        <img
          src={`/assets/fighters/${item.warband}/${item.warband}-0.png`}
          alt={`${item.warband} warscroll`}
        />
      </picture>
    </div>
  );
};

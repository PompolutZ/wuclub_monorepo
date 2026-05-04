import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { Grid3x3, Minus, Plus } from "lucide-react";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import { DiceRoller } from "@components/DiceRoller";
import { FIGHTER_TOKEN_SCALE, FighterToken } from "@components/FighterToken";
import { TREASURE_TOKEN_SCALE, TreasureToken } from "@components/TreasureToken";
import type { Warband } from "@components/WarbandPicker";
import { boards } from "../../../../../shared/boards";
import {
  BOARD_LAYERS,
  type BoardLayer,
  type BoardRotation,
  type PlacedToken,
} from "../Room/BoardOverlay";
import { BoardArea } from "./BoardArea";
import { AssetsDrawer } from "./AssetsDrawer";
import { DEFAULT_WARBAND } from "./WarbandDropdown";
import {
  Canvas,
  STAGE_CENTER_X,
  STAGE_CENTER_Y,
  ZOOM_MAX,
  ZOOM_MIN,
  ZOOM_STEP,
} from "./Canvas";
import { CanvasItemView } from "./CanvasItem";
import { isTokenKind } from "./itemHelpers";
import type {
  BoardSetting,
  CanvasItem,
  DragState,
  DragTemplate,
  HexCoord,
} from "./types";

const CARD_CLAMP_PADDING = 24;

type DropTarget =
  | { kind: "drawer" }
  | { kind: "hex"; hex: HexCoord; centerX: number; centerY: number }
  | { kind: "board" }
  | { kind: "canvas" };

const ToolsPage = () => {
  const isMobile = useBreakpoint("mobile");
  const [boardSetting, setBoardSetting] = useState<BoardSetting>({
    boardId: boards[0].id,
    rotation: 0,
    modifying: false,
  });
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [activeWarband, setActiveWarband] = useState<Warband>(DEFAULT_WARBAND);
  const [zoom, setZoom] = useState(1);
  const [hexesVisible, setHexesVisible] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [drag, setDrag] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const itemsRef = useRef<CanvasItem[]>(items);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const commitDropRef = useRef<
    (current: DragState, clientX: number, clientY: number) => void
  >(() => undefined);

  commitDropRef.current = (
    current: DragState,
    clientX: number,
    clientY: number,
  ) => {
    const target = resolveDropTarget(clientX, clientY);
    const toStage = makeViewportToStage(stageRef.current, zoom);

    if (current.source === "canvas") {
      if (target.kind === "drawer") {
        setItems((prev) => prev.filter((it) => it.id !== current.itemId));
        return;
      }
      const existing = itemsRef.current.find((it) => it.id === current.itemId);
      if (!existing) return;
      const updated = applyDropToItem(
        existing,
        target,
        clientX,
        clientY,
        current.offsetX,
        current.offsetY,
        boardRef.current,
        toStage,
      );
      const blocked = itemsRef.current.some(
        (it) => it.id !== current.itemId && sameHexSameLayer(it, updated),
      );
      if (blocked) return;
      setItems((prev) =>
        prev.map((it) => (it.id === current.itemId ? updated : it)),
      );
      return;
    }

    if (target.kind === "drawer") return;
    const created = createItemFromTemplate(
      current.template,
      target,
      clientX,
      clientY,
      boardRef.current,
      toStage,
    );
    const blocked = itemsRef.current.some((it) =>
      sameHexSameLayer(it, created),
    );
    if (blocked) return;
    setItems((prev) => [...prev, created]);
  };

  useEffect(() => {
    dragRef.current = drag;
  }, [drag]);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t) return;
      if (
        t.closest("[data-canvas-item]") ||
        t.closest("polygon[data-col]") ||
        t.closest("[data-template]")
      ) {
        return;
      }
      if (!e.shiftKey) setSelectedIds(new Set());
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  const dragging = !!drag;
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      setDrag((d) =>
        d ? { ...d, clientX: e.clientX, clientY: e.clientY } : null,
      );
    };
    const onUp = (e: PointerEvent) => {
      const current = dragRef.current;
      if (current) commitDropRef.current(current, e.clientX, e.clientY);
      setDrag(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging]);

  if (isMobile) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-center text-gray-700">
          Tools is desktop-only for now.
        </p>
      </div>
    );
  }

  const handleTemplatePointerDown = (
    e: ReactPointerEvent<HTMLElement>,
    template: DragTemplate,
  ) => {
    setSelectedIds(new Set());
    setDrag({
      source: "drawer",
      template,
      clientX: e.clientX,
      clientY: e.clientY,
    });
  };

  const handleItemPointerDown = (
    e: ReactPointerEvent<HTMLElement>,
    itemId: string,
  ) => {
    const item = itemsRef.current.find((it) => it.id === itemId);
    if (!item) return;
    if (e.shiftKey) {
      setSelectedIds((prev) => toggleSelection(prev, itemId));
      return;
    }
    setSelectedIds((prev) => (prev.has(itemId) ? prev : new Set([itemId])));
    const stage = stageRef.current;
    let offsetX = 0;
    let offsetY = 0;
    if (stage) {
      const rect = stage.getBoundingClientRect();
      offsetX = e.clientX - (rect.left + item.x * zoom);
      offsetY = e.clientY - (rect.top + item.y * zoom);
    }
    setDrag({
      source: "canvas",
      itemId,
      offsetX,
      offsetY,
      clientX: e.clientX,
      clientY: e.clientY,
    });
  };

  const handleHexPointerDown = (
    e: ReactPointerEvent<SVGPolygonElement>,
    col: number,
    row: number,
  ) => {
    if (boardSetting.modifying) return;
    const item = topmostItemAtHex(itemsRef.current, col, row);
    if (!item) {
      if (!e.shiftKey) setSelectedIds(new Set());
      return;
    }
    if (e.shiftKey) {
      setSelectedIds((prev) => toggleSelection(prev, item.id));
      return;
    }
    setSelectedIds((prev) => (prev.has(item.id) ? prev : new Set([item.id])));
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setDrag({
      source: "canvas",
      itemId: item.id,
      offsetX: e.clientX - cx,
      offsetY: e.clientY - cy,
      clientX: e.clientX,
      clientY: e.clientY,
    });
  };

  const cycleBoard = (delta: number) => {
    const idx = boards.findIndex((b) => b.id === boardSetting.boardId);
    const next = boards[(idx + delta + boards.length) % boards.length];
    setBoardSetting((s) => ({ ...s, boardId: next.id }));
    setItems((prev) => prev.filter((it) => !hasHex(it)));
  };

  const rotateBy = (delta: 90 | 270) => {
    setBoardSetting((s) => ({
      ...s,
      rotation: ((s.rotation + delta) % 360) as BoardRotation,
    }));
  };

  const draggingCanvasId = drag?.source === "canvas" ? drag.itemId : null;

  const placed: PlacedToken[] = items
    .filter(hasHex)
    .filter((it) => it.id !== draggingCanvasId)
    .map((it) =>
      buildPlacedToken(it, boardSetting.modifying, selectedIds.has(it.id)),
    );

  const canvasChildren = items.filter(
    (it) => !hasHex(it) && it.id !== draggingCanvasId,
  );

  const draggingItem = draggingCanvasId
    ? items.find((it) => it.id === draggingCanvasId)
    : null;

  const ghostFromTemplate =
    drag?.source === "drawer"
      ? buildGhostFromTemplate(drag.template, drag.clientX, drag.clientY)
      : null;

  return (
    <div className="flex-1 relative">
      <div className="absolute inset-0 grid grid-cols-[1fr_auto] grid-rows-[auto_1fr]">
        <header className="col-start-1 row-start-1 flex items-center justify-end gap-3 px-4 py-2 border-b border-gray-200">
          <DiceRoller />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))
              }
              disabled={zoom <= ZOOM_MIN}
              aria-label="Zoom out"
              className="grid place-items-center w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" aria-hidden />
            </button>
            <span className="w-12 text-center text-sm tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() =>
                setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))
              }
              disabled={zoom >= ZOOM_MAX}
              aria-label="Zoom in"
              className="grid place-items-center w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" aria-hidden />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setHexesVisible((v) => !v)}
            aria-label={hexesVisible ? "Hide hex grid" : "Show hex grid"}
            aria-pressed={hexesVisible}
            className={`grid place-items-center w-8 h-8 rounded border text-sm hover:bg-gray-100 ${
              hexesVisible
                ? "border-purple-500 text-purple-700 bg-purple-50"
                : "border-gray-300 text-gray-500"
            }`}
          >
            <Grid3x3 className="w-4 h-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() =>
              setBoardSetting((s) => ({ ...s, modifying: !s.modifying }))
            }
            className="px-3 py-1 rounded border border-gray-300 text-sm font-medium hover:bg-gray-100"
          >
            {boardSetting.modifying ? "Save" : "Modify board"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (selectedIds.size > 0) {
                setItems((prev) =>
                  prev.filter((it) => !selectedIds.has(it.id)),
                );
                setSelectedIds(new Set());
              } else {
                setItems([]);
              }
            }}
            disabled={items.length === 0}
            className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedIds.size > 0
              ? `Delete ${selectedIds.size} selected ${selectedIds.size === 1 ? "item" : "items"}`
              : "Clear canvas"}
          </button>
        </header>
        <Canvas
          className="col-start-1 row-start-2"
          zoom={zoom}
          setZoom={setZoom}
          stageRef={stageRef}
        >
          <div
            className="absolute z-10"
            style={{
              left: STAGE_CENTER_X,
              top: STAGE_CENTER_Y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <BoardArea
              boardId={boardSetting.boardId}
              rotation={boardSetting.rotation}
              modifying={boardSetting.modifying}
              placed={placed}
              boardRef={boardRef}
              hexesVisible={hexesVisible}
              onPrevBoard={() => cycleBoard(-1)}
              onNextBoard={() => cycleBoard(1)}
              onRotateCw={() => rotateBy(90)}
              onRotateCcw={() => rotateBy(270)}
              onHexPointerDown={handleHexPointerDown}
            />
          </div>
          {canvasChildren.map((item) => (
            <CanvasItemView
              key={item.id}
              item={item}
              isDragging={false}
              position="absolute"
              dimmed={boardSetting.modifying}
              selected={selectedIds.has(item.id)}
              onPointerDown={handleItemPointerDown}
            />
          ))}
        </Canvas>
        <div className="col-start-2 row-start-1 row-span-2 min-h-0 overflow-hidden">
          <AssetsDrawer
            activeWarband={activeWarband}
            onSelectWarband={setActiveWarband}
            onTemplatePointerDown={handleTemplatePointerDown}
          />
        </div>
      </div>
      {draggingItem && drag?.source === "canvas" && (
        <CanvasItemView
          key={`drag-${draggingItem.id}`}
          item={{
            ...draggingItem,
            x: drag.clientX - drag.offsetX,
            y: drag.clientY - drag.offsetY,
          }}
          isDragging
          zoomScale={zoom}
          onPointerDown={handleItemPointerDown}
        />
      )}
      {ghostFromTemplate && (
        <CanvasItemView
          key="ghost"
          item={ghostFromTemplate}
          isDragging
          zoomScale={zoom}
          onPointerDown={() => undefined}
        />
      )}
    </div>
  );
};

export default ToolsPage;

function toggleSelection(prev: Set<string>, id: string): Set<string> {
  const next = new Set(prev);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

// Tokens that snap to hexes. Markers are excluded — they're free-placed.
type TokenItem = Extract<
  CanvasItem,
  { kind: "treasure-cover" | "treasure" | "fighter-token" }
>;

function hasHex(item: CanvasItem): item is TokenItem & { hex: HexCoord } {
  if (item.kind === "fighter-card" || item.kind === "warband-scroll") {
    return false;
  }
  return item.hex !== undefined;
}

function topmostItemAtHex(
  items: CanvasItem[],
  col: number,
  row: number,
): CanvasItem | null {
  let best: CanvasItem | null = null;
  let bestRank = -1;
  for (const it of items) {
    if (!hasHex(it)) continue;
    if (it.hex.col !== col || it.hex.row !== row) continue;
    const layer = layerOf(it);
    if (!layer) continue;
    const rank = BOARD_LAYERS.indexOf(layer);
    if (rank > bestRank) {
      best = it;
      bestRank = rank;
    }
  }
  return best;
}

function sameHexSameLayer(a: CanvasItem, b: CanvasItem): boolean {
  if (a.id === b.id) return false;
  if (!hasHex(a) || !hasHex(b)) return false;
  if (a.hex.col !== b.hex.col || a.hex.row !== b.hex.row) return false;
  return layerOf(a) === layerOf(b);
}

function layerOf(item: CanvasItem): BoardLayer | null {
  switch (item.kind) {
    case "treasure-cover":
    case "treasure":
      return "feature";
    case "fighter-token":
      return "fighter";
    case "marker":
      return "marker";
    default:
      return null;
  }
}

function buildPlacedToken(
  item: TokenItem & { hex: HexCoord },
  dimmed: boolean,
  selected: boolean,
): PlacedToken {
  const common = { id: item.id, col: item.hex.col, row: item.hex.row };
  const fill = "block w-full h-full";
  const wrap = (node: ReactNode) => {
    if (dimmed) {
      return <div className="w-full h-full opacity-40 grayscale">{node}</div>;
    }
    if (selected) {
      return (
        <div
          className="w-full h-full"
          style={{ filter: "drop-shadow(0 0 6px rgba(147, 51, 234, 0.95))" }}
        >
          {node}
        </div>
      );
    }
    return node;
  };
  switch (item.kind) {
    case "treasure-cover":
      return {
        ...common,
        scale: TREASURE_TOKEN_SCALE * item.scale,
        layer: "feature",
        content: wrap(
          <TreasureToken face="cover" className={fill} draggable={false} />,
        ),
      };
    case "treasure":
      return {
        ...common,
        scale: TREASURE_TOKEN_SCALE * item.scale,
        layer: "feature",
        content: wrap(
          <TreasureToken face={item.n} className={fill} draggable={false} />,
        ),
      };
    case "fighter-token":
      return {
        ...common,
        scale: FIGHTER_TOKEN_SCALE * item.scale,
        layer: "fighter",
        content: wrap(
          <FighterToken
            warband={item.warband}
            fighter={item.fighter}
            className={fill}
            draggable={false}
          />,
        ),
      };
  }
}

function resolveDropTarget(clientX: number, clientY: number): DropTarget {
  const target = document.elementFromPoint(clientX, clientY);
  if (!target) return { kind: "canvas" };
  if (target.closest("[data-drawer]")) return { kind: "drawer" };
  const polygon = target.closest<SVGPolygonElement>("polygon[data-col]");
  if (polygon) {
    const rect = polygon.getBoundingClientRect();
    return {
      kind: "hex",
      hex: {
        col: Number(polygon.dataset.col),
        row: Number(polygon.dataset.row),
      },
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
    };
  }
  if (target.closest("[data-board-area]")) return { kind: "board" };
  return { kind: "canvas" };
}

function clampOutsideBoard(
  x: number,
  y: number,
  boardEl: HTMLElement | null,
): { x: number; y: number } {
  if (!boardEl) return { x, y };
  const rect = boardEl.getBoundingClientRect();
  if (x < rect.left || x > rect.right) return { x, y };
  const distLeft = x - rect.left;
  const distRight = rect.right - x;
  const clampedX =
    distLeft < distRight
      ? rect.left - CARD_CLAMP_PADDING
      : rect.right + CARD_CLAMP_PADDING;
  return { x: clampedX, y };
}

function buildGhostFromTemplate(
  template: DragTemplate,
  x: number,
  y: number,
): CanvasItem {
  return buildItem(template, "__ghost__", x, y, undefined);
}

// Per-kind default instance scale. Stored on each item so a future override
// can resize a single instance without touching siblings.
const DEFAULT_ITEM_SCALE: Record<CanvasItem["kind"], number> = {
  "treasure-cover": 1,
  treasure: 1,
  "fighter-token": 1,
  marker: 1,
  "fighter-card": 1,
  "warband-scroll": 1,
};

function buildItem(
  template: DragTemplate,
  id: string,
  x: number,
  y: number,
  hex: HexCoord | undefined,
): CanvasItem {
  switch (template.kind) {
    case "treasure-cover":
      return {
        kind: "treasure-cover",
        id,
        x,
        y,
        hex,
        scale: DEFAULT_ITEM_SCALE["treasure-cover"],
      };
    case "treasure":
      return {
        kind: "treasure",
        id,
        n: template.n,
        x,
        y,
        hex,
        scale: DEFAULT_ITEM_SCALE.treasure,
      };
    case "fighter-token":
      return {
        kind: "fighter-token",
        id,
        warband: template.warband,
        fighter: template.fighter,
        x,
        y,
        hex,
        scale: DEFAULT_ITEM_SCALE["fighter-token"],
      };
    case "marker":
      return {
        kind: "marker",
        id,
        marker: template.marker,
        x,
        y,
        hex,
        scale: DEFAULT_ITEM_SCALE.marker,
      };
    case "fighter-card":
      return {
        kind: "fighter-card",
        id,
        warband: template.warband,
        fighter: template.fighter,
        isInspired: template.isInspired,
        x,
        y,
        scale: DEFAULT_ITEM_SCALE["fighter-card"],
      };
    case "warband-scroll":
      return {
        kind: "warband-scroll",
        id,
        warband: template.warband,
        x,
        y,
        scale: DEFAULT_ITEM_SCALE["warband-scroll"],
      };
  }
}

type ToStage = (vx: number, vy: number) => { x: number; y: number };

function makeViewportToStage(
  stageEl: HTMLElement | null,
  zoom: number,
): ToStage {
  if (!stageEl) return (vx, vy) => ({ x: vx, y: vy });
  const rect = stageEl.getBoundingClientRect();
  return (vx, vy) => ({
    x: (vx - rect.left) / zoom,
    y: (vy - rect.top) / zoom,
  });
}

function createItemFromTemplate(
  template: DragTemplate,
  target: DropTarget,
  clientX: number,
  clientY: number,
  boardEl: HTMLElement | null,
  toStage: ToStage,
): CanvasItem {
  const id = crypto.randomUUID();
  // Markers are free-placed: no hex snap, no board clamp, can overlap.
  if (template.kind === "marker") {
    const { x, y } = toStage(clientX, clientY);
    return buildItem(template, id, x, y, undefined);
  }
  const isToken = isTokenKind(template.kind);
  if (isToken && target.kind === "hex") {
    const { x, y } = toStage(target.centerX, target.centerY);
    return buildItem(template, id, x, y, target.hex);
  }
  if (!isToken && (target.kind === "hex" || target.kind === "board")) {
    const clamped = clampOutsideBoard(clientX, clientY, boardEl);
    const { x, y } = toStage(clamped.x, clamped.y);
    return buildItem(template, id, x, y, undefined);
  }
  const { x, y } = toStage(clientX, clientY);
  return buildItem(template, id, x, y, undefined);
}

function applyDropToItem(
  item: CanvasItem,
  target: DropTarget,
  clientX: number,
  clientY: number,
  offsetX: number,
  offsetY: number,
  boardEl: HTMLElement | null,
  toStage: ToStage,
): CanvasItem {
  const proposedVX = clientX - offsetX;
  const proposedVY = clientY - offsetY;
  // Markers are free-placed: no hex snap, no board clamp, can overlap.
  if (item.kind === "marker") {
    const { x, y } = toStage(proposedVX, proposedVY);
    return { ...item, x, y, hex: undefined } as CanvasItem;
  }
  const isToken = isTokenKind(item.kind);
  if (isToken && target.kind === "hex") {
    const { x, y } = toStage(target.centerX, target.centerY);
    return { ...item, x, y, hex: target.hex } as CanvasItem;
  }
  if (isToken) {
    const { x, y } = toStage(proposedVX, proposedVY);
    return { ...item, x, y, hex: undefined } as CanvasItem;
  }
  if (target.kind === "hex" || target.kind === "board") {
    const clamped = clampOutsideBoard(proposedVX, proposedVY, boardEl);
    const { x, y } = toStage(clamped.x, clamped.y);
    return { ...item, x, y } as CanvasItem;
  }
  const { x, y } = toStage(proposedVX, proposedVY);
  return { ...item, x, y } as CanvasItem;
}

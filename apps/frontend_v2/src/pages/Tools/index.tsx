import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { Minus, Plus } from "lucide-react";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import { DiceRoller } from "@components/DiceRoller";
import { warbandsValidForOrganisedPlay } from "@fxdxpz/wudb";
import { FIGHTER_TOKEN_SCALE, FighterToken } from "@components/FighterToken";
import { TREASURE_TOKEN_SCALE, TreasureToken } from "@components/TreasureToken";
import type { Warband } from "@components/WarbandPicker";
import { boards } from "../../../../../shared/boards";
import type {
  BoardLayer,
  BoardRotation,
  PlacedToken,
} from "../Room/BoardOverlay";
import { BoardArea } from "./BoardArea";
import { AssetsDrawer } from "./AssetsDrawer";
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

// Warbands whose fighter assets have been migrated to slug-based filenames.
// Tools restricts the dropdown to these so we don't render broken images for
// older warbands that still use numeric (`-1.png`, `-2.png`) asset paths.
const MIGRATED_WARBANDS = new Set([
  "blackpowders-buccaneers",
  "blood-of-the-bull",
  "borgits-beastgrabbaz",
  "brethren-of-the-bolt",
  "cyrenis-razors",
  "da-kunnin-krew",
  "daggoks-stab-ladz",
  "elathains-soulraid",
  "ephilims-pandaemonium",
  "gnarlspirit-pack",
  "gorechosen-of-dromm",
  "grandfathers-gardeners",
  "grinkraks-looncourt",
  "hexbanes-hunters",
  "hrothgorns-mantrappers",
  "ironsouls-condemners",
  "jaws-of-itzl",
  "kainans-reapers",
  "kamandoras-blades",
  "khagras-ravagers",
  "knives-of-the-crone",
  "kurnoths-heralds",
  "mollogs-mob",
  "morgoks-krushas",
  "myaris-purifiers",
  "rippas-snarlfangs",
  "sepulchral-guard",
  "skittershanks-clawpack",
  "sons-of-velmorn",
  "spiteclaws-swarm",
  "thanateks-tithe",
  "the-crimson-court",
  "the-dread-pageant",
  "the-emberwatch",
  "the-exiled-dead",
  "the-farstriders",
  "the-grymwatch",
  "the-headsmens-curse",
  "the-shadeborn",
  "the-skinnerkin",
  "the-starblood-stalkers",
  "the-thricefold-discord",
  "the-wurmspat",
  "thorns-of-the-briar-queen",
  "thundriks-profiteers",
  "xandires-truthseekers",
  "yltharis-guardians",
  "zarbags-gitz",
  "zikkits-tunnelpack",
  "zondaras-gravebreakers",
]);

const PICKABLE_WARBANDS: Warband[] = warbandsValidForOrganisedPlay.filter((w) =>
  MIGRATED_WARBANDS.has(w.name),
);
const DEFAULT_WARBAND =
  PICKABLE_WARBANDS.find((w) => w.name === "cyrenis-razors") ??
  PICKABLE_WARBANDS[0];

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
      setItems((prev) =>
        prev
          .filter((it) => !sameHexSameLayer(it, updated))
          .map((it) => (it.id === current.itemId ? updated : it)),
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
    setItems((prev) => [
      ...prev.filter((it) => !sameHexSameLayer(it, created)),
      created,
    ]);
  };

  useEffect(() => {
    dragRef.current = drag;
  }, [drag]);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

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
    .map((it) => buildPlacedToken(it, boardSetting.modifying));

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
            onClick={() =>
              setBoardSetting((s) => ({ ...s, modifying: !s.modifying }))
            }
            className="px-3 py-1 rounded border border-gray-300 text-sm font-medium hover:bg-gray-100"
          >
            {boardSetting.modifying ? "Save" : "Modify board"}
          </button>
          <button
            type="button"
            onClick={() => setItems([])}
            disabled={items.length === 0}
            className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear canvas
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
              onPrevBoard={() => cycleBoard(-1)}
              onNextBoard={() => cycleBoard(1)}
              onRotateCw={() => rotateBy(90)}
              onRotateCcw={() => rotateBy(270)}
            />
          </div>
          {canvasChildren.map((item) => (
            <CanvasItemView
              key={item.id}
              item={item}
              isDragging={false}
              position="absolute"
              dimmed={boardSetting.modifying}
              onPointerDown={handleItemPointerDown}
            />
          ))}
        </Canvas>
        <div className="col-start-2 row-start-1 row-span-2 min-h-0 overflow-hidden">
          <AssetsDrawer
            warbands={PICKABLE_WARBANDS}
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
          scale={zoom}
          onPointerDown={handleItemPointerDown}
        />
      )}
      {ghostFromTemplate && (
        <CanvasItemView
          key="ghost"
          item={ghostFromTemplate}
          isDragging
          scale={zoom}
          onPointerDown={() => undefined}
        />
      )}
    </div>
  );
};

export default ToolsPage;

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
    default:
      return null;
  }
}

function buildPlacedToken(
  item: TokenItem & { hex: HexCoord },
  dimmed: boolean,
): PlacedToken {
  const common = { id: item.id, col: item.hex.col, row: item.hex.row };
  const fill = "block w-full h-full";
  const wrap = (node: ReactNode) =>
    dimmed ? (
      <div className="w-full h-full opacity-40 grayscale">{node}</div>
    ) : (
      node
    );
  switch (item.kind) {
    case "treasure-cover":
      return {
        ...common,
        scale: TREASURE_TOKEN_SCALE,
        layer: "feature",
        content: wrap(
          <TreasureToken face="cover" className={fill} draggable={false} />,
        ),
      };
    case "treasure":
      return {
        ...common,
        scale: TREASURE_TOKEN_SCALE,
        layer: "feature",
        content: wrap(
          <TreasureToken face={item.n} className={fill} draggable={false} />,
        ),
      };
    case "fighter-token":
      return {
        ...common,
        scale: FIGHTER_TOKEN_SCALE,
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

function buildItem(
  template: DragTemplate,
  id: string,
  x: number,
  y: number,
  hex: HexCoord | undefined,
): CanvasItem {
  switch (template.kind) {
    case "treasure-cover":
      return { kind: "treasure-cover", id, x, y, hex };
    case "treasure":
      return { kind: "treasure", id, n: template.n, x, y, hex };
    case "fighter-token":
      return {
        kind: "fighter-token",
        id,
        warband: template.warband,
        fighter: template.fighter,
        x,
        y,
        hex,
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
      };
    case "warband-scroll":
      return {
        kind: "warband-scroll",
        id,
        warband: template.warband,
        x,
        y,
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
  const isToken = isTokenKind(item.kind);
  const proposedVX = clientX - offsetX;
  const proposedVY = clientY - offsetY;
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

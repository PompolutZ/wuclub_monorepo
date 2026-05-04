import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";

export const STAGE_WIDTH = 1400;
export const STAGE_HEIGHT = 1400;
export const STAGE_CENTER_X = STAGE_WIDTH / 2;
export const STAGE_CENTER_Y = STAGE_HEIGHT / 2;
export const ZOOM_MIN = 0.5;
export const ZOOM_MAX = 2;
export const ZOOM_STEP = 0.1;

type Props = {
  className?: string;
  zoom: number;
  setZoom: (next: number) => void;
  stageRef?: RefObject<HTMLDivElement | null>;
  children: ReactNode;
};

const clampZoom = (z: number) =>
  Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, +z.toFixed(3)));

export const Canvas = ({
  className,
  zoom,
  setZoom,
  stageRef,
  children,
}: Props) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const fallbackStageRef = useRef<HTMLDivElement | null>(null);
  const stageNodeRef = stageRef ?? fallbackStageRef;
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const anchorRef = useRef<{
    sx: number;
    sy: number;
    cx: number;
    cy: number;
  } | null>(null);

  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const stage = stageNodeRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const z = zoomRef.current;
      const sx = (e.clientX - rect.left) / z;
      const sy = (e.clientY - rect.top) / z;
      const next = clampZoom(z * Math.exp(-e.deltaY * 0.01));
      if (next === z) return;
      anchorRef.current = { sx, sy, cx: e.clientX, cy: e.clientY };
      setZoom(next);
    };
    scroll.addEventListener("wheel", onWheel, { passive: false });
    return () => scroll.removeEventListener("wheel", onWheel);
  }, [setZoom, stageNodeRef]);

  useLayoutEffect(() => {
    const a = anchorRef.current;
    if (!a) return;
    anchorRef.current = null;
    const scroll = scrollRef.current;
    const stage = stageNodeRef.current;
    if (!scroll || !stage) return;
    const rect = stage.getBoundingClientRect();
    scroll.scrollLeft += rect.left - a.cx + a.sx * zoom;
    scroll.scrollTop += rect.top - a.cy + a.sy * zoom;
  }, [zoom, stageNodeRef]);

  return (
    <div className={`relative min-h-0 min-w-0 ${className ?? ""}`}>
      <div ref={scrollRef} className="absolute inset-0 overflow-auto">
        <div className="min-w-full min-h-full grid place-items-center p-4">
          <div
            style={{
              width: STAGE_WIDTH * zoom,
              height: STAGE_HEIGHT * zoom,
            }}
          >
            <div
              ref={stageNodeRef as RefObject<HTMLDivElement>}
              className="relative"
              style={{
                width: STAGE_WIDTH,
                height: STAGE_HEIGHT,
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

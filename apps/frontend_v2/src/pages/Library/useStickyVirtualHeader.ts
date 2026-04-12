import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { Virtualizer } from "@tanstack/react-virtual";
import type { VirtualRow } from "./Library";

const HEADER_HEIGHT_FALLBACK = 52;

export function useStickyVirtualHeader(
  virtualRows: VirtualRow[],
  stickyIndices: number[],
  virtualizer: Virtualizer<HTMLDivElement, Element>,
  parentRef: RefObject<HTMLDivElement>,
  overlayRef: RefObject<HTMLDivElement>,
) {
  const [activeHeader, setActiveHeader] = useState<
    (VirtualRow & { type: "header" }) | null
  >(null);
  const activeIdxRef = useRef(-1);

  const stickyUpdateRef = useRef<() => void>(() => {});
  stickyUpdateRef.current = () => {
    const el = parentRef.current;
    if (!el || !overlayRef.current || stickyIndices.length === 0) return;

    const scrollTop = el.scrollTop;
    const measurements = virtualizer.measurementsCache;

    let newActiveIdx = stickyIndices[0];
    let activeStart = measurements[newActiveIdx]?.start ?? 0;
    let nextStart: number | undefined;

    for (let i = 0; i < stickyIndices.length; i++) {
      const m = measurements[stickyIndices[i]];
      if (m && m.start <= scrollTop + 1) {
        newActiveIdx = stickyIndices[i];
        activeStart = m.start;
        nextStart =
          i + 1 < stickyIndices.length
            ? measurements[stickyIndices[i + 1]]?.start
            : undefined;
      }
    }

    if (newActiveIdx !== activeIdxRef.current) {
      activeIdxRef.current = newActiveIdx;
      const row = virtualRows[newActiveIdx];
      if (row?.type === "header") setActiveHeader(row);
    }

    const headerHeight = overlayRef.current.children[0]
      ? (overlayRef.current.children[0] as HTMLElement).offsetHeight
      : HEADER_HEIGHT_FALLBACK;

    if (nextStart !== undefined) {
      const distanceToNext = nextStart - scrollTop;
      overlayRef.current.style.transform =
        distanceToNext < headerHeight
          ? `translateY(${distanceToNext - headerHeight}px)`
          : "";
    } else {
      overlayRef.current.style.transform = "";
    }

    overlayRef.current.style.opacity = scrollTop >= activeStart ? "1" : "0";
  };

  useLayoutEffect(() => {
    activeIdxRef.current = -1;
  }, [stickyIndices]);

  useLayoutEffect(() => stickyUpdateRef.current());

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;
    const onScroll = () => stickyUpdateRef.current();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  });

  return { activeHeader };
}

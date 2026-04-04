import { useState } from "react";
import useMeasure from "react-use-measure";

interface UseResizeHeightConfig {
  open: boolean;
  /** When provided, auto-opens/closes when value crosses the 0 ↔ >0 boundary */
  syncWith?: number;
}

export function useResizeHeight(config: UseResizeHeightConfig) {
  const [ref, { height }] = useMeasure();
  const [open, setOpen] = useState(config.open);
  const [prevHasItems, setPrevHasItems] = useState(
    config.syncWith !== undefined ? config.syncWith > 0 : config.open,
  );

  if (config.syncWith !== undefined) {
    const hasItems = config.syncWith > 0;
    if (hasItems !== prevHasItems) {
      setOpen(hasItems);
      setPrevHasItems(hasItems);
    }
  }

  const toggle = () => setOpen((prev) => !prev);

  return [ref, open, toggle, height] as const;
}

import { ElementRef, PropsWithChildren, useCallback, useRef } from "react";
import ReactDOM from "react-dom";

export const usePortal = () => {
  const ref = useRef<ElementRef<"div">>(document.createElement("div"));
  const clickAwayHelperRef = useRef<ElementRef<"div">>(null);

  const Portal = useCallback(
    ({ children }: PropsWithChildren) =>
      ReactDOM.createPortal(
        <div className="fixed inset-0 backdrop-blur-sm z-10 bg-slate-900/5">
          {children}
        </div>,
        ref.current,
      ),
    [],
  );

  const close = useCallback(() => {
    document.body.removeChild(ref.current);
  }, []);

  const open = useCallback(() => {
    document.body.appendChild(ref.current);
    const handleMouseDownEvent = (e: MouseEvent) => {
      if (
        clickAwayHelperRef.current &&
        !clickAwayHelperRef.current.contains(e.target as Node)
      ) {
        document.removeEventListener("mousedown", handleMouseDownEvent);
        close();
      }
    };

    document.addEventListener("mousedown", handleMouseDownEvent);
  }, [close]);

  return {
    Portal,
    portalClickAwayRef: clickAwayHelperRef,
    open,
    close,
  };
};

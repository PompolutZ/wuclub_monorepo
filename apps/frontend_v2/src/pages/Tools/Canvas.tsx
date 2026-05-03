import type { ReactNode, RefObject } from "react";

export const STAGE_WIDTH = 1400;
export const STAGE_HEIGHT = 1400;
export const STAGE_CENTER_X = STAGE_WIDTH / 2;
export const STAGE_CENTER_Y = STAGE_HEIGHT / 2;

type Props = {
  className?: string;
  zoom: number;
  stageRef?: RefObject<HTMLDivElement | null>;
  children: ReactNode;
};

export const Canvas = ({ className, zoom, stageRef, children }: Props) => (
  <div className={`relative min-h-0 min-w-0 ${className ?? ""}`}>
    <div className="absolute inset-0 overflow-auto">
      <div className="min-w-full min-h-full grid place-items-center p-4">
        <div
          style={{
            width: STAGE_WIDTH * zoom,
            height: STAGE_HEIGHT * zoom,
          }}
        >
          <div
            ref={stageRef as RefObject<HTMLDivElement>}
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

import type { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

export const Canvas = ({ className, children }: Props) => (
  <div className={`relative min-h-0 min-w-0 ${className ?? ""}`}>
    <div className="absolute inset-0 overflow-auto">
      <div className="min-w-full min-h-full grid place-items-center p-4">
        {children}
      </div>
    </div>
  </div>
);

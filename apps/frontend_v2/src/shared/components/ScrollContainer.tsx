import { ReactNode } from "react";

interface ScrollContainerProps {
  children: ReactNode;
  className?: string;
}

export const ScrollContainer = ({ children, className = "" }: ScrollContainerProps) => (
  <div className={`flex-1 relative ${className}`}>
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
      {children}
    </div>
  </div>
);

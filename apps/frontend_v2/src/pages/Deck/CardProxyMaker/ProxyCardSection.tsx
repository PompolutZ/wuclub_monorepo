import type { ReactNode } from "react";

interface ProxyCardSectionProps {
  title: string;
  selected: number;
  total: number;
  children: ReactNode;
}

export const ProxyCardSection = ({ title, selected, total, children }: ProxyCardSectionProps) => (
  <section>
    <h3 className="text-sm font-bold text-gray-700 mb-2">
      {title} <span className="font-normal text-gray-500">{selected}/{total}</span>
    </h3>
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">{children}</div>
  </section>
);

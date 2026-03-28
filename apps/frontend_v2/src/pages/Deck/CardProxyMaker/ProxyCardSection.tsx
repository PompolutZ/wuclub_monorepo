import type { ReactNode } from "react";

interface ProxyCardSectionProps {
  title: string;
  children: ReactNode;
}

export const ProxyCardSection = ({ title, children }: ProxyCardSectionProps) => (
  <section>
    <h3 className="text-sm font-bold text-gray-700 mb-2">{title}</h3>
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">{children}</div>
  </section>
);

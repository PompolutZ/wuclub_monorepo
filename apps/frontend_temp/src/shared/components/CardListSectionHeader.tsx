import React, { useMemo } from "react";
import { cardTypes } from "../../data/wudb";
import toLower from "lodash/toLower";

type CardListSectionHeaderProps = {
    type: "Objectives" | "Gambits" | "Upgrades";
    amount: number;
    children?: React.ReactNode;
    className?: string;
};

export function CardListSectionHeader({
  type,
  amount,
  children,
  className = "",
}: CardListSectionHeaderProps) {
  const listTypes = useMemo(() => {
    switch (type) {
      case "Objectives":
        return cardTypes.filter((t) => t === "Objective").map(toLower);
      case "Gambits":
        return cardTypes
          .filter((t) => t === "Ploy")
          .map(toLower);
      case "Upgrades":
        return cardTypes.filter((t) => t === "Upgrade").map(toLower);
    }
  }, [type]);

  return (
    <div
      className={`flex items-center border-b border-gray-500 pb-2 ${className}`}
    >
      <div className="mr-2 flex">
        {listTypes.map((t) => (
          <img
            className="w-8 h-8"
            key={t}
            src={`/assets/icons/${t}-icon.png`}
            alt={t}
          />
        ))}
      </div>
      <h1 className="text-gray-900 text-xl mr-2">{`${amount} ${type}`}</h1>
      {children}
    </div>
  );
}

import React from "react";
import {
  CHAMPIONSHIP_FORMAT,
  checkCardIsObjective,
  checkCardIsPloy,
  checkCardIsUpgrade,
  getCardById,
  RELIC_FORMAT,
  validateDeckForPlayFormat,
} from "@fxdxpz/wudb";
import type { CardId } from "@fxdxpz/wudb";
import ChampionshipLogo from "@icons/championship_logo.svg?react";
import RelicLogo from "@icons/relic_logo.svg?react";
import VanguardLogo from "@icons/vanguard_logo.svg?react";

const VANGUARD_FORMAT = "vanguard" as const;

function DetailedPlayStyleValidity({
  cards,
  className = "",
}: {
  cards: CardId[];
  className?: string;
}) {
  const allCards = cards.map((cid) => getCardById(cid));
  const cardsByType = {
    objectives: allCards.filter(checkCardIsObjective),
    gambits: allCards.filter(checkCardIsPloy),
    upgrades: allCards.filter(checkCardIsUpgrade),
  };
  const [championshipValid] = validateDeckForPlayFormat(
    cardsByType,
    CHAMPIONSHIP_FORMAT as never,
  );
  const [relicValid] = validateDeckForPlayFormat(
    cardsByType,
    RELIC_FORMAT as never,
  );
  const [vanguardValid] = validateDeckForPlayFormat(
    cardsByType,
    VANGUARD_FORMAT as never,
  );

  return (
    <div className={`mx-4 my-4 lg:flex lg:items-center lg:gap-2 ${className}`}>
      <div className="flex items-center">
        <ChampionshipLogo
          className={`fill-current text-2xl ${
            championshipValid ? "text-green-700" : "text-red-600"
          }`}
        />
        <h3 className={""}>Championship</h3>
      </div>
      <div className="flex items-center">
        <VanguardLogo
          className={`fill-current text-2xl ${
            vanguardValid ? "text-green-700" : "text-red-600"
          }`}
        />
        <h3 className={""}>Vanguard</h3>
      </div>
      <div className="flex items-center">
        <RelicLogo
          className={`fill-current text-2xl ${
            relicValid ? "text-green-700" : "text-red-600"
          } fill-current text-green-700`}
        />
        <h3 className={""}>Relic</h3>
      </div>
    </div>
  );
}

export default DetailedPlayStyleValidity;

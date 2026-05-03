import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { factionMembers, type FactionName } from "@fxdxpz/wudb";
import { FighterCard } from "@components/FighterCard";
import type { Warband } from "@components/WarbandPicker";
import {
  TREASURE_COVER_HREF,
  fighterTokenHref,
  treasureFaceHref,
} from "@/shared/tokens";
import { WarbandDropdown } from "./WarbandDropdown";
import type { DragTemplate, TreasureNumber } from "./types";

const TREASURES: TreasureNumber[] = [1, 2, 3, 4, 5];
const WARBANDS_WITH_FIGHTER_TOKENS = new Set(["cyrenis-razors"]);

type Props = {
  warbands: Warband[];
  activeWarband: Warband;
  onSelectWarband: (w: Warband) => void;
  onTemplatePointerDown: (
    e: ReactPointerEvent<HTMLElement>,
    template: DragTemplate,
  ) => void;
};

export const AssetsDrawer = ({
  warbands,
  activeWarband,
  onSelectWarband,
  onTemplatePointerDown,
}: Props) => {
  const fighters =
    factionMembers[activeWarband.name as keyof typeof factionMembers] ?? [];
  const showFighterTokens = WARBANDS_WITH_FIGHTER_TOKENS.has(
    activeWarband.name,
  );

  return (
    <aside
      data-drawer
      className="w-80 shrink-0 border-l border-gray-200 bg-white p-4 overflow-y-auto"
    >
      <Section title="Tokens">
        <div className="flex flex-wrap gap-2">
          <DrawerToken
            src={TREASURE_COVER_HREF}
            alt="Treasure cover"
            onPointerDown={(e) =>
              onTemplatePointerDown(e, { kind: "treasure-cover" })
            }
          />
          {TREASURES.map((n) => (
            <DrawerToken
              key={n}
              src={treasureFaceHref(n)}
              alt={`Treasure ${n}`}
              onPointerDown={(e) =>
                onTemplatePointerDown(e, { kind: "treasure", n })
              }
            />
          ))}
        </div>
      </Section>

      <Section title="Warband">
        <WarbandDropdown
          warbands={warbands}
          selected={activeWarband}
          onSelect={onSelectWarband}
        />
      </Section>

      <Section title="Fighter cards">
        <div className="grid grid-cols-2 gap-2">
          {fighters.map((_, i) => {
            const fighterIdx = i + 1;
            return (
              <DrawerCard
                key={fighterIdx}
                onPointerDown={(e) =>
                  onTemplatePointerDown(e, {
                    kind: "fighter-card",
                    warband: activeWarband.name,
                    fighterIdx,
                    isInspired: false,
                  })
                }
              >
                <FighterCard
                  faction={activeWarband.name as FactionName}
                  index={fighterIdx}
                  className="block w-full pointer-events-none"
                />
              </DrawerCard>
            );
          })}
        </div>
      </Section>

      {showFighterTokens && (
        <Section title="Fighter tokens">
          <div className="flex flex-wrap gap-2">
            {fighters.map((_, i) => {
              const fighterIdx = i + 1;
              return (
                <DrawerToken
                  key={fighterIdx}
                  src={fighterTokenHref(activeWarband.name, fighterIdx)}
                  alt={`${activeWarband.displayName} fighter ${fighterIdx} token`}
                  onPointerDown={(e) =>
                    onTemplatePointerDown(e, {
                      kind: "fighter-token",
                      warband: activeWarband.name,
                      fighterIdx,
                    })
                  }
                />
              );
            })}
          </div>
        </Section>
      )}

      <Section title="Warscroll">
        <DrawerCard
          onPointerDown={(e) =>
            onTemplatePointerDown(e, {
              kind: "warband-scroll",
              warband: activeWarband.name,
            })
          }
        >
          <picture className="block w-full pointer-events-none">
            <source
              type="image/webp"
              srcSet={`/assets/fighters/${activeWarband.name}/${activeWarband.name}-0.webp`}
            />
            <img
              src={`/assets/fighters/${activeWarband.name}/${activeWarband.name}-0.png`}
              alt={`${activeWarband.displayName} warscroll`}
            />
          </picture>
        </DrawerCard>
      </Section>
    </aside>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="mb-5">
    <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">
      {title}
    </h3>
    {children}
  </section>
);

type DrawerTokenProps = {
  src: string;
  alt: string;
  onPointerDown: (e: ReactPointerEvent<HTMLImageElement>) => void;
};

const DrawerToken = ({ src, alt, onPointerDown }: DrawerTokenProps) => (
  <img
    src={src}
    alt={alt}
    draggable={false}
    width={56}
    height={56}
    className="cursor-grab select-none"
    style={{ touchAction: "none" }}
    onPointerDown={onPointerDown}
  />
);

const DrawerCard = ({
  children,
  onPointerDown,
}: {
  children: ReactNode;
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
}) => (
  <div
    className="cursor-grab w-full"
    style={{ touchAction: "none" }}
    onPointerDown={onPointerDown}
  >
    {children}
  </div>
);

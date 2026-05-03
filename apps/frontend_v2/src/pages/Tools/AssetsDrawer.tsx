import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { factionMembers, type FactionName } from "@fxdxpz/wudb";
import { FighterCard } from "@components/FighterCard";
import { FighterToken } from "@components/FighterToken";
import { TreasureToken } from "@components/TreasureToken";
import type { Warband } from "@components/WarbandPicker";
import { WarbandDropdown } from "./WarbandDropdown";
import type { DragTemplate, TreasureNumber } from "./types";

const TREASURES: TreasureNumber[] = [1, 2, 3, 4, 5];

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

  return (
    <aside
      data-drawer
      className="w-80 shrink-0 border-l border-gray-200 bg-white p-4 overflow-y-auto"
    >
      <Section title="Tokens">
        <div className="flex flex-wrap gap-2">
          <DrawerSlot
            onPointerDown={(e) =>
              onTemplatePointerDown(e, { kind: "treasure-cover" })
            }
          >
            <TreasureToken
              face="cover"
              draggable={false}
              width={56}
              height={56}
              className="select-none"
            />
          </DrawerSlot>
          {TREASURES.map((n) => (
            <DrawerSlot
              key={n}
              onPointerDown={(e) =>
                onTemplatePointerDown(e, { kind: "treasure", n })
              }
            >
              <TreasureToken
                face={n}
                draggable={false}
                width={56}
                height={56}
                className="select-none"
              />
            </DrawerSlot>
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
          {fighters.map((fighter) => (
            <DrawerCard
              key={fighter}
              onPointerDown={(e) =>
                onTemplatePointerDown(e, {
                  kind: "fighter-card",
                  warband: activeWarband.name,
                  fighter,
                  isInspired: false,
                })
              }
            >
              <FighterCard
                faction={activeWarband.name as FactionName}
                fighter={fighter}
                className="block w-full pointer-events-none"
              />
            </DrawerCard>
          ))}
        </div>
      </Section>

      <Section title="Fighter tokens">
        <div className="flex flex-wrap gap-2">
          {fighters.map((fighter) => (
            <DrawerSlot
              key={fighter}
              onPointerDown={(e) =>
                onTemplatePointerDown(e, {
                  kind: "fighter-token",
                  warband: activeWarband.name,
                  fighter,
                })
              }
            >
              <FighterToken
                warband={activeWarband.name}
                fighter={fighter}
                draggable={false}
                width={56}
                height={56}
                className="select-none"
              />
            </DrawerSlot>
          ))}
        </div>
      </Section>

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
              srcSet={`/assets/fighters/${activeWarband.name}/${activeWarband.name}-warscroll.webp`}
            />
            <img
              src={`/assets/fighters/${activeWarband.name}/${activeWarband.name}-warscroll.png`}
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

const DrawerSlot = ({
  children,
  onPointerDown,
}: {
  children: ReactNode;
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
}) => (
  <div
    className="cursor-grab"
    style={{ touchAction: "none" }}
    onPointerDown={onPointerDown}
  >
    {children}
  </div>
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

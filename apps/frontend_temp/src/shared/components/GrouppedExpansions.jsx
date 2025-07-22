import React, { useState } from "react";
import { wusets } from "../../data/wudb";
import { useMultiSelectArray } from "../../hooks/useMultiSelectArray";
import IconButton from "./IconButton";
import SectionTitle from "./SectionTitle";

const createExpansionGroups = () => {
  const season1 = [
    wusets["Blazing Assault Rivals Deck"].id,
    wusets["Countdown to Cataclysm Rivals Deck"].id,
    wusets["Edge of the Knife Rivals Deck"].id,
    wusets["Emberstone Sentinels Rivals Deck"].id,
    wusets["Pillage and Plunder Rivals Deck"].id,
    wusets["Raging Slayers Rivals Deck"].id,
    wusets["Realmstone Raiders Rivals Deck"].id,
    wusets["Reckless Fury Rivals Deck"].id,
    wusets["Wrack and Ruin Rivals Deck"].id,
  ];

  return [
    {
      title: "Season 1",
      expansions: Object.values(wusets).filter((exp) =>
        season1.includes(exp.id),
      ),
    },
  ];
};

function ExpansionPicture({ setName, ...rest }) {
  return (
    <picture>
      <source type="image/webp" srcSet={`/assets/icons/decks/${setName}.webp`} />
      <img
        src={`/assets/icons/decks/${setName}.png`}
        alt={`${setName}`}
        {...rest}
      />
    </picture>
  );
}

const GrouppedExpansions = ({
  onSelectionChanged,
  selectedExpansions = [],
  validSetIds = [],
}) => {
  const expansionGroups = createExpansionGroups();
  const { onToggle } = useMultiSelectArray(
    selectedExpansions,
    true,
    validSetIds,
    onSelectionChanged,
  );

  return (
    <section className="flex flex-col space-y-2 mx-4">
      <SectionTitle title="Expansions" />
      {expansionGroups.map(({ title, expansions }) => (
        <article key={title}>
          <h6 className="text-xs font-bold text-gray-500">{title}</h6>
          <div className="m-2 flex flex-wrap content-start items-center">
            {expansions.map((expansion) => (
              <IconButton
                className="mb-2 mr-2"
                key={expansion.id}
                onClick={onToggle(expansion.id)}
                disabled={!validSetIds.includes(expansion.id)}
              >
                <ExpansionPicture
                  setName={expansion.name}
                  className={`w-8 h-8 ${
                    validSetIds.includes(expansion.id)
                      ? "drop-shadow-md hover:scale-105"
                      : "drop-shadow-none grayscale pointer-events-none"
                  } ${
                    selectedExpansions.includes(expansion.id)
                      ? "opacity-100"
                      : "opacity-50"
                  }`}
                />
              </IconButton>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
};

export { GrouppedExpansions };

import { wusets } from "../../data/wudb";
import type { SetId } from "../../data/wudb";
import { useMultiSelectArray } from "../../hooks/useMultiSelectArray";
import IconButton from "./IconButton";
import SectionTitle from "./SectionTitle";
import { ExpansionPicture } from "./ExpansionPicture";

const createExpansionGroups = () => {
  const season1 = [
    wusets["BL"].id,
    wusets["CC"].id,
    wusets["EK"].id,
    wusets["ES"].id,
    wusets["PL"].id,
    wusets["RS"].id,
    wusets["RF"].id,
    wusets["WR"].id,
    wusets["RG"].id,
  ];

  const season2 = [
    wusets["HG"].id,
    wusets["DY"].id,
    wusets["NP"].id,
  ];

  return [
    {
      title: "Season 2",
      expansions: Object.values(wusets).filter((exp) =>
        (season2 as string[]).includes(exp.id),
      ),
    },
    {
      title: "Season 1",
      expansions: Object.values(wusets).filter((exp) =>
        (season1 as string[]).includes(exp.id),
      ),
    },
  ];
};

interface GroupedExpansionsProps {
  onSelectionChanged: (selected: SetId[]) => void;
  selectedExpansions?: SetId[];
  validSetIds?: SetId[];
}

export const GroupedExpansions = ({
  onSelectionChanged,
  selectedExpansions = [],
  validSetIds = [],
}: GroupedExpansionsProps) => {
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
                onClick={onToggle(expansion.id as SetId)}
                disabled={!validSetIds.includes(expansion.id as SetId)}
              >
                <ExpansionPicture
                  setName={expansion.name}
                  className={`w-8 h-8 ${
                    validSetIds.includes(expansion.id as SetId)
                      ? "drop-shadow-md hover:scale-105"
                      : "drop-shadow-none grayscale pointer-events-none"
                  } ${
                    selectedExpansions.includes(expansion.id as SetId)
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

import { useMemo } from "react";
import ScoringOverview from "../../../../atoms/ScoringOverview";
import { CardsList } from "./CardsList";
import { CardListSectionHeader } from "../../../../shared/components/CardListSectionHeader";
import SectionTitle from "../../../../shared/components/SectionTitle";
import type { EnrichedCard } from "../../reducer";
import { animated, useSpring } from "@react-spring/web";
import { useResizeHeight } from "../../../../hooks/useResizeHeight";
import { ExpandCollapseButton } from "../../../../shared/components/ExpandCollapseButton";

interface ObjectivesListProps {
  selectedObjectives: EnrichedCard[];
  format: string;
  isValid: boolean;
}

function ObjectivesList({
  selectedObjectives,
  format,
  isValid,
}: ObjectivesListProps) {
  const [measureRef, open, toggle, contentHeight] = useResizeHeight({
    open: true,
  });
  const expand = useSpring({
    height: open ? `${contentHeight}px` : "0px",
  });

  const { surge, end, totalGlory, objectiveSummary } = useMemo(() => {
    const surge = [];
    const end = [];
    let totalGlory = 0;
    const objectiveSummary = { Surge: 0, End: 0, Third: 0 };

    for (const c of selectedObjectives) {
      totalGlory += c.glory ?? 0;
      if (c.scoreType === "Surge") {
        objectiveSummary.Surge++;
        surge.push(c);
      } else if (c.scoreType === "End") {
        objectiveSummary.End++;
        end.push(c);
      }
    }

    return { surge, end, totalGlory, objectiveSummary };
  }, [selectedObjectives]);

  return (
    <div
      className={`${isValid ? "bg-green-100" : "bg-red-200"} p-2 mb-4 lg:mb-0`}
    >
      <CardListSectionHeader
        className="border-none"
        type="Objectives"
        amount={selectedObjectives.length}
      >
        <>
          <ScoringOverview summary={objectiveSummary} glory={totalGlory} />
          <ExpandCollapseButton
            open={open}
            className="ml-auto lg:hidden outline-none shadow-md text-white bg-purple-700 rounded-full hover:bg-purple-500 focus:text-white"
            onClick={toggle}
          />
        </>
      </CardListSectionHeader>

      <animated.div style={expand} className="overflow-hidden">
        <div ref={measureRef} className="pb-1">
          {surge.length > 0 && (
            <section className="mt-4 mb-2">
              <SectionTitle className="my-2" title="Surge" />
              <CardsList format={format} cards={surge} />
            </section>
          )}
          {end.length > 0 && (
            <section className="mt-4 mb-4">
              <SectionTitle className="mt-4 mb-2" title="End Phase" />
              <CardsList format={format} cards={end} />
            </section>
          )}
        </div>
      </animated.div>
    </div>
  );
}

export default ObjectivesList;

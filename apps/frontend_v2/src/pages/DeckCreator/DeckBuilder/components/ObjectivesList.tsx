import { useMemo } from "react";
import ScoringOverview from "../../../../atoms/ScoringOverview";
import { CardsList } from "./CardsList";
import SectionTitle from "../../../../shared/components/SectionTitle";
import type { EnrichedCard } from "../../reducer";
import { CardSectionPanel } from "./CardSectionPanel";

interface ObjectivesListProps {
  selectedObjectives: EnrichedCard[];
  format: string;
  isValid: boolean;
}

export function ObjectivesList({
  selectedObjectives,
  format,
  isValid,
}: ObjectivesListProps) {
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
    <CardSectionPanel
      type="Objectives"
      amount={selectedObjectives.length}
      isValid={isValid}
      headerExtra={
        <ScoringOverview summary={objectiveSummary} glory={totalGlory} />
      }
    >
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
    </CardSectionPanel>
  );
}


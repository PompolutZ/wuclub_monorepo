import { CardsList } from "./CardsList";
import type { EnrichedCard } from "../../reducer";
import { CardSectionPanel } from "./CardSectionPanel";

interface GambitsListProps {
  selectedGambits: EnrichedCard[];
  format: string;
  isValid: boolean;
}

export function GambitsList({ selectedGambits, format, isValid }: GambitsListProps) {
  return (
    <CardSectionPanel
      type="Gambits"
      amount={selectedGambits.length}
      isValid={isValid}
    >
      <CardsList format={format} cards={selectedGambits} />
    </CardSectionPanel>
  );
}


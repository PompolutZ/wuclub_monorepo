import { FactionDeckPicture } from "@components/FactionDeckPicture";
import SaveIcon from "@icons/save.svg?react";
import CloseIcon from "@icons/x.svg?react";
import { useMemo } from "react";
import { useDeckBuilderState } from "../..";
import {
  validateCardForPlayFormat,
  validateDeckForPlayFormat,
} from "../../../../data/wudb";
import type { Card } from "../../../../data/wudb";
import { DebouncedInput } from "../../../../shared/components/DebouncedInput";
import { STATUS_SAVING } from "../../reducer";
import type { EnrichedCard } from "../../reducer";
import GambitsList from "./GambitsList";
import ObjectivesList from "./ObjectivesList";
import UpgradesList from "./UpgradesList";

function enrichCard(c: Card, format: string): EnrichedCard {
  const [, isForsaken, isRestricted] = validateCardForPlayFormat(
    c,
    format as never,
  );
  return { ...c, isBanned: isForsaken, isRestricted };
}

interface DeckProps {
  deckName: string;
  onDeckNameChange: (name: string) => void;
  onSave: () => void;
  onReset: () => void;
}

function Deck({ deckName, onDeckNameChange, onSave, onReset }: DeckProps) {
  const {
    faction,
    selectedObjectives,
    selectedGambits,
    selectedUpgrades,
    format,
    status,
    saveError,
  } = useDeckBuilderState();

  const objectives = useMemo(
    () => selectedObjectives.map((c) => enrichCard(c, format)),
    [selectedObjectives, format],
  );

  const gambits = useMemo(
    () => selectedGambits.map((c) => enrichCard(c, format)),
    [selectedGambits, format],
  );

  const upgrades = useMemo(
    () => selectedUpgrades.map((c) => enrichCard(c, format)),
    [selectedUpgrades, format],
  );

  const [isValid, issues] = useMemo(
    () =>
      validateDeckForPlayFormat(
        { objectives, gambits, upgrades },
        format as never,
      ),
    [objectives, gambits, upgrades, format],
  );

  const isSaving = status === STATUS_SAVING;

  return (
    <div>
      <div className="flex items-center">
        <div className="flex flex-1 items-center m-2 space-x-2">
          <FactionDeckPicture faction={faction.name} />
          <DebouncedInput
            value={deckName}
            onChange={onDeckNameChange}
            placeholder={`${faction.displayName} Deck`}
            className="rounded h-12 bg-gray-200 box-border flex-1 mr-2 py-1 px-2 outline-none border-2 focus:border-purple-700"
          />
          <button
            className="btn btn-purple w-8 h-8 py-0 px-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onSave}
            disabled={isSaving}
          >
            <SaveIcon />
          </button>
          <button className="btn btn-red w-8 h-8 py-0 px-1" onClick={onReset}>
            <CloseIcon />
          </button>
        </div>
      </div>

      {saveError && (
        <p className="text-red-600 text-sm px-4 py-1">{saveError}</p>
      )}

      <section className="my-4 text-accent3-700 text-sm p-4">
        {!isValid && (
          <ul>
            {issues.map((issue, i) => (
              <li key={i}>{issue}</li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-col xl:grid xl:grid-cols-3 xl:gap-2">
        <ObjectivesList
          isValid={isValid}
          format={format}
          selectedObjectives={objectives}
        />
        <GambitsList
          isValid={isValid}
          format={format}
          selectedGambits={gambits}
        />
        <UpgradesList
          isValid={isValid}
          format={format}
          selectedUpgrades={upgrades}
        />
      </div>
    </div>
  );
}

export default Deck;

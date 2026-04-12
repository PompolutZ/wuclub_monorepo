import { Overlay } from "@/shared/components/Overlay";
import {
  FactionDeckPicture,
  FactionPicture,
} from "@components/FactionDeckPicture";
import TogglesIcon from "@icons/sliders.svg?react";
import CloseIcon from "@icons/x.svg?react";
import { useMemo, useState } from "react";
import { useDeckBuilderDispatcher, useDeckBuilderState } from "../..";
import { ExpansionSeasonToggle } from "../../../../shared/components/ExpansionSeasonToggle";
import {
  getAllSetsValidForFormat,
  NEMESIS_FORMAT,
  RIVALS_FORMAT,
  warbandsValidForOrganisedPlay,
} from "@fxdxpz/wudb";
import type { Faction } from "../../reducer";
import type { Set as WuSet, SetId } from "@fxdxpz/wudb";
import NemesisSetsInfo from "./NemesisSetsInfo";
import { DebouncedInput } from "../../../../shared/components/DebouncedInput";
import { DeckPlayFormatInfo } from "../../../../shared/components/DeckPlayFormatInfo";
import { DeckPlayFormatToggle } from "../../../../shared/components/DeckPlayFormatToggle";
import IconButton from "../../../../shared/components/IconButton";
import SectionTitle from "../../../../shared/components/SectionTitle";
import { WarbandPicker } from "../../../../shared/components/WarbandPicker";

interface SelectedFactionProps {
  faction: Faction;
  className?: string;
}
function SelectedFaction({ faction, className }: SelectedFactionProps) {
  return (
    <div className={`flex flex-grow ${className ?? ""}`}>
      <FactionDeckPicture faction={faction.name} size="large" />
      <div className="flex-grow grid place-content-center text-gray-900 text-2xl">
        {faction.displayName}
      </div>
    </div>
  );
}

interface CardLibraryFiltersProps {
  onSearchTextChange: (text: string) => void;
}

function CardLibraryFilters({ onSearchTextChange }: CardLibraryFiltersProps) {
  const state = useDeckBuilderState();
  const dispatch = useDeckBuilderDispatcher();

  const [showFilters, setShowFilters] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(state.format);

  /// Here will be new approach, keeping the rest for now
  const validSets = useMemo(
    () => getAllSetsValidForFormat(selectedFormat as never),
    [selectedFormat],
  );
  const [warband, setWarband] = useState(state.faction);
  const [selectedSets, setSelectedSets] = useState<WuSet[]>(state.sets);

  const [prevFormat, setPrevFormat] = useState(selectedFormat);
  if (selectedFormat !== prevFormat) {
    setPrevFormat(selectedFormat);
    setSelectedSets(
      selectedFormat === NEMESIS_FORMAT
        ? validSets.slice(0, 2)
        : validSets.slice(0, 1),
    );
  }

  const handleFormatChange = (format: string) => {
    setSelectedFormat(format);
  };

  const handleExpansionToggle = (setId: SetId) => {
    if (selectedFormat === RIVALS_FORMAT) {
      const set = validSets.find((s) => s.id === setId);
      if (set) setSelectedSets([set]);
    } else {
      const isSelected = selectedSets.some((s) => s.id === setId);
      if (isSelected) {
        setSelectedSets(selectedSets.filter((s) => s.id !== setId));
      } else {
        const set = validSets.find((s) => s.id === setId);
        if (set) setSelectedSets([...selectedSets, set]);
      }
    }
  };

  const closeAndUpdateFilters = () => {
    setShowFilters(false);
    dispatch({
      type: "UPDATE_FILTERS",
      payload: {
        faction: warband,
        sets: selectedSets,
        format: selectedFormat,
      },
    });
  };

  return (
    <>
      <div className="flex items-center">
        <IconButton
          className="rounded-full mr-1 w-12 h-12 drop-shadow-md bg-gray-100 grid place-content-center relative hover:bg-gray-100 focus:text-purple-700"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FactionPicture faction={state.faction.name} size="w-11 h-11" />
        </IconButton>

        <DebouncedInput
          className="rounded h-12 bg-gray-200 box-border flex-1 py-1 px-2 outline-none border-2 focus:border-purple-700"
          placeholder="Search for any text on card"
          onChange={onSearchTextChange}
        />
        <IconButton
          className="rounded-full ml-3 px-2 w-11 h-11 grid place-content-center relative hover:bg-gray-100 focus:text-purple-700"
          onClick={() => setShowFilters(!showFilters)}
        >
          <TogglesIcon />
        </IconButton>
      </div>

      <Overlay visible={showFilters}>
        <div className="flex-1 flex flex-col pt-4 pb-12">
          <IconButton
            onClick={closeAndUpdateFilters}
            className="rounded-full ml-3 px-2 w-11 h-11 grid place-content-center relative hover:bg-gray-100 self-end"
          >
            <CloseIcon />
          </IconButton>
          <section className="overflow-y-auto px-4 pb-8">
            <SectionTitle title="Warband" />
            <SelectedFaction faction={warband} />
            <WarbandPicker
              warbands={warbandsValidForOrganisedPlay as Faction[]}
              selected={warband}
              onSelect={(w) => setWarband(w as Faction)}
              iconSize="w-12 h-12"
            />

            <SectionTitle title="Format" className="my-8" />

            <div className="flex flex-col items-center">
              <DeckPlayFormatToggle
                formats={[NEMESIS_FORMAT, RIVALS_FORMAT]}
                selectedFormat={selectedFormat}
                onFormatChange={handleFormatChange}
              />

              <DeckPlayFormatInfo
                className="text-gray-900 text-sm mt-2"
                format={selectedFormat}
              />
            </div>

            <SectionTitle title="Sets" className="my-8" />
            {selectedFormat === NEMESIS_FORMAT && (
              <NemesisSetsInfo selectedSets={selectedSets} />
            )}

            <ExpansionSeasonToggle
              expansions={validSets}
              selectedIds={selectedSets.map((s) => s.id as SetId)}
              onToggle={handleExpansionToggle}
            />
          </section>
        </div>
      </Overlay>
    </>
  );
}

export default CardLibraryFilters;

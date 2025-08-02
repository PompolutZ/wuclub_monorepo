import { Overlay } from "@/shared/components/Overlay";
import {
  FactionDeckPicture,
  FactionPicture,
} from "@components/FactionDeckPicture";
import TogglesIcon from "@icons/sliders.svg?react";
import CloseIcon from "@icons/x.svg?react";
import React, { useEffect, useMemo, useState } from "react";
import { useDeckBuilderDispatcher, useDeckBuilderState } from "../..";
import ExpansionsToggle from "../../../../components/ExpansionsToggle";
import {
  getAllSetsValidForFormat,
  NEMESIS_FORMAT,
  RIVALS_FORMAT,
  warbandsValidForOrganisedPlay,
  wufactions,
} from "../../../../data/wudb";
import { DebouncedInput } from "../../../../shared/components/DebouncedInput";
import { DeckPlayFormatInfo } from "../../../../shared/components/DeckPlayFormatInfo";
import { DeckPlayFormatToggle } from "../../../../shared/components/DeckPlayFormatToggle";
import IconButton from "../../../../shared/components/IconButton";
import SectionTitle from "../../../../shared/components/SectionTitle";

function SelectedFaction({ faction = "morgwaeths-blade-coven", ...rest }) {
  return (
    <div className={`flex flex-grow ${rest.className}`}>
      <FactionDeckPicture faction={faction.name} size="large" />
      <div className="flex-grow grid place-content-center text-gray-900 text-2xl">
        {faction.displayName}
      </div>
    </div>
  );
}

const notPlayableFactionIds = [
  wufactions["u"].id,
  wufactions["gao"].id,
  wufactions["gad"].id,
  wufactions["gads"].id,
  wufactions["gac"].id,
];

function FactionsPicker({
  selected,
  onChangeWarband,
  selectableWarbands,
  ...rest
}) {
  const handleSelectWarband = (faction) => () => {
    onChangeWarband(faction);
  };

  return (
    <div className={`flex flex-wrap align-middle ${rest.className}`}>
      {selectableWarbands
        .filter(
          (faction) =>
            faction.id != selected.id &&
            !notPlayableFactionIds.includes(faction.id),
        )
        .reverse()
        .map((faction) => (
          <button
            key={faction.id}
            className="[all:unset] [cursor:pointer]"
            onClick={handleSelectWarband(faction)}
          >
            <FactionPicture size="w-12 h-12" faction={faction.name} />
          </button>
        ))}
    </div>
  );
}

function CardLibraryFilters(props) {
  const state = useDeckBuilderState();
  const dispatch = useDeckBuilderDispatcher();

  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedFormat, setSelectedFormat] = useState(state.format);

  /// Here will be new approach, keeping the rest for now
  const validSets = useMemo(
    () => getAllSetsValidForFormat(selectedFormat),
    [selectedFormat],
  );
  const [warband, setWarband] = useState(state.faction);
  const [hideDuplicates, setHideDuplicates] = useState(true);
  const [selectedSets, setSelectedSets] = useState(
    selectedFormat === NEMESIS_FORMAT
      ? validSets.slice(0, 2)
      : [validSets.at(0)],
  );

  const handleFormatChange = (format) => {
    setSelectedFormat(format);
  };

  const closeAndUpdateFilters = () => {
    setShowFilters(!showFilters);
    dispatch({
      type: "UPDATE_FILTERS",
      payload: {
        faction: warband,
        sets: selectedSets,
        hideDuplicates,
        format: selectedFormat,
      },
    });
  };

  // meh, but for now...
  useEffect(() => {
    setSelectedSets(() => {
      if (selectedFormat === NEMESIS_FORMAT) {
        return validSets.slice(0, 2);
      } else {
        return [validSets.at(0)];
      }
    });
  }, [selectedFormat, validSets]);

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
          onChange={props.onSearchTextChange}
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
            <SectionTitle className="mb-8" title="Warband" />

            <SelectedFaction faction={warband} />

            <FactionsPicker
              selected={warband}
              onChangeWarband={setWarband}
              selectableWarbands={warbandsValidForOrganisedPlay}
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

            <ExpansionsToggle
              singleSet={selectedFormat === RIVALS_FORMAT}
              expansions={validSets}
              selectedExpansions={selectedSets}
              onExpansionsChange={setSelectedSets}
            />
          </section>
        </div>
      </Overlay>
    </>
  );
}

export default CardLibraryFilters;

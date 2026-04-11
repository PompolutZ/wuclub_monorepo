import { useCallback, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import type { Warband } from "../../shared/components/WarbandPicker";

const VIEW_KEY = "view";
const SELECTED_KEY = "selected";
const VIEW_WARBANDS = "warbands";

interface Options {
  validSetIds: string[];
  playableWarbands: Warband[];
}

export function useLibrarySearchParams({
  validSetIds,
  playableWarbands,
}: Options) {
  const { search, pathname } = useLocation();
  const history = useHistory();

  const params = useMemo(() => new URLSearchParams(search), [search]);

  const isWarbands = params.get(VIEW_KEY) === VIEW_WARBANDS;
  const activeTabIndex = isWarbands ? 1 : 0;

  const selectedExpansionIds = useMemo(() => {
    if (isWarbands) return validSetIds;
    const raw = params.get(SELECTED_KEY);
    if (!raw) return validSetIds;
    const ids = raw.split(",").filter((id) => validSetIds.includes(id));
    return ids.length > 0 ? ids : validSetIds;
  }, [params, isWarbands, validSetIds]);

  const selectedFaction = useMemo(() => {
    if (!isWarbands) return playableWarbands[0];
    const raw = params.get(SELECTED_KEY);
    if (!raw) return playableWarbands[0];
    return playableWarbands.find((w) => w.id === raw) ?? playableWarbands[0];
  }, [params, isWarbands, playableWarbands]);

  const replaceParams = useCallback(
    (updater: (p: URLSearchParams) => void) => {
      const next = new URLSearchParams(search);
      updater(next);
      // view=decks is default — omit it
      if (next.get(VIEW_KEY) !== VIEW_WARBANDS) next.delete(VIEW_KEY);
      const qs = next.toString();
      history.replace({ pathname, search: qs ? `?${qs}` : "" });
    },
    [history, pathname, search],
  );

  const setActiveTabIndex = useCallback(
    (index: number) => {
      replaceParams((p) => {
        p.set(VIEW_KEY, index === 1 ? VIEW_WARBANDS : "decks");
        p.delete(SELECTED_KEY);
      });
    },
    [replaceParams],
  );

  const setSelectedExpansionIds = useCallback(
    (ids: string[]) => {
      replaceParams((p) => {
        const allSelected =
          ids.length === validSetIds.length &&
          validSetIds.every((id) => ids.includes(id));
        if (allSelected) {
          p.delete(SELECTED_KEY);
        } else {
          p.set(SELECTED_KEY, ids.join(","));
        }
      });
    },
    [replaceParams, validSetIds],
  );

  const setSelectedFaction = useCallback(
    (faction: Warband) => {
      replaceParams((p) => {
        if (faction.id === playableWarbands[0].id) {
          p.delete(SELECTED_KEY);
        } else {
          p.set(SELECTED_KEY, faction.id);
        }
      });
    },
    [replaceParams, playableWarbands],
  );

  return {
    activeTabIndex,
    setActiveTabIndex,
    selectedExpansionIds,
    setSelectedExpansionIds,
    selectedFaction,
    setSelectedFaction,
  };
}

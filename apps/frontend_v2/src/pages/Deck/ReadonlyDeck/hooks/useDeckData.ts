import { useMemo } from 'react';
import { Factions } from '@fxdxpz/schema';
import { SetId } from '@wudb';
import { checkCardIsObjective, checkCardIsPloy, checkCardIsUpgrade, compareObjectivesByScoreType } from '../../../../data/wudb';
import type { DeckCard, ProcessedDeck } from '../types';

export function useDeckData(
  id: string,
  name: string,
  author: string,
  faction: Factions,
  sets: SetId[],
  created: string | undefined,
  createdutc: number | undefined,
  updatedutc: number | undefined,
  isPrivate: boolean,
  cards: DeckCard[] = []
): ProcessedDeck {
  return useMemo(() => {
    const objectives = cards
      .filter(checkCardIsObjective)
      .sort((a, b) => compareObjectivesByScoreType(a.scoreType, b.scoreType));

    const gambits = cards
      .filter(checkCardIsPloy)
      .sort((a, b) => a.name.localeCompare(b.name));

    const upgrades = cards
      .filter(checkCardIsUpgrade)
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      id,
      name,
      author,
      faction,
      sets,
      created,
      createdutc,
      updatedutc,
      objectives,
      gambits,
      upgrades,
      private: isPrivate,
    };
  }, [id, name, author, faction, sets, created, createdutc, updatedutc, isPrivate, cards]);
}

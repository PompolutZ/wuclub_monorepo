import { useMemo } from 'react';
import { Factions } from '@fxdxpz/schema';
import { SetId } from '@wudb';
import { checkCardIsObjective, checkCardIsPloy, checkCardIsUpgrade, compareObjectivesByScoreType } from '../../../../data/wudb';
import type { DeckCard, ProcessedDeck } from '../types';

interface UseDeckDataParams {
  id: string;
  name: string;
  factionId: string;
  faction: Factions;
  sets: SetId[];
  created?: string;
  createdutc?: number;
  updatedutc?: number;
  isPrivate: boolean;
  cards?: DeckCard[];
}

export function useDeckData({
  id,
  name,
  factionId,
  faction,
  sets,
  created,
  createdutc,
  updatedutc,
  isPrivate,
  cards = [],
}: UseDeckDataParams): ProcessedDeck {
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
      factionId,
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
  }, [id, name, factionId, faction, sets, created, createdutc, updatedutc, isPrivate, cards]);
}

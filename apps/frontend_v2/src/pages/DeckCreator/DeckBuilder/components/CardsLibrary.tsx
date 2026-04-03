import { FixedVirtualizedList } from "@components/FixedVirtualizedList";
import { useMemo } from "react";
import { useDeckBuilderDispatcher, useDeckBuilderState } from "../..";
import {
  validateCardForPlayFormat,
  wucards,
  wufactions,
} from "../../../../data/wudb";
import type { Card } from "../../../../data/wudb";
import { toggleCardAction } from "../../reducer";
import type { CardFilter } from "../../reducer";
import CardInDeck from "./Card";

interface FilterableCardLibraryProps {
  searchText: string;
  filter: CardFilter;
}

type CardListItem = {
  card: Card & { isBanned: boolean; isRestricted: boolean };
  expanded: boolean;
  isNameDuplicate: boolean;
};

function stringTypeToNumber(type: string): number {
  switch (type) {
    case "Objective":
      return 0;
    case "Ploy":
      return 1;
    case "Upgrade":
      return 2;
    default:
      return 3;
  }
}

const _sort = (card1: Card, card2: Card) =>
  stringTypeToNumber(card1.type) - stringTypeToNumber(card2.type);

function FilterableCardLibrary({
  searchText,
  filter,
}: FilterableCardLibraryProps) {
  const dispatch = useDeckBuilderDispatcher();
  const state = useDeckBuilderState();

  const deck = useMemo(
    () => [
      ...state.selectedObjectives,
      ...state.selectedGambits,
      ...state.selectedUpgrades,
    ],
    [state.selectedObjectives, state.selectedGambits, state.selectedUpgrades],
  );

  const filteredCards = useMemo(() => {
    const deckCardNames = new Set(deck.map((c) => c.name));

    let cards = Object.values(wucards)
      .filter(
        (card) =>
          !!state.sets.find((set) => set.id == card.setId) &&
          card.factionId === wufactions["u"].id,
      )
      .filter((card) => (filter.test ? filter.test(card) : true))
      .filter((card) => {
        const [isValid] = validateCardForPlayFormat(card, state.format);
        return isValid;
      })
      .map((c) => {
        const [, isForsaken, isRestricted] = validateCardForPlayFormat(
          c,
          state.format,
        );
        return { ...c, isBanned: isForsaken, isRestricted };
      });

    if (isNaN(Number(searchText))) {
      cards = cards.filter((c) => {
        if (!searchText) return true;
        return (
          c.name.toUpperCase().includes(searchText.toUpperCase()) ||
          c.rule.toUpperCase().includes(searchText.toUpperCase())
        );
      });
    } else {
      cards = cards.filter(({ id }) =>
        `${id}`.padStart(5, "0").includes(searchText),
      );
    }

    return cards.sort(_sort).map((card) => ({
      card,
      expanded: false,
      isNameDuplicate:
        !deck.find(({ id }) => id === card.id) && deckCardNames.has(card.name),
    }));
  }, [state.sets, state.format, filter, searchText, deck]);

  return (
    <div className="flex-1 flex outline-none">
      <FixedVirtualizedList items={filteredCards} onLoadMore={() => {}}>
        {(item, { key, index }) => {
          const { card, isNameDuplicate } = item as CardListItem;
          return card ? (
            <div
              key={key}
              className={`flex flex-col justify-center pr-2 ${
                index % 2 === 0 ? "bg-purple-100" : "bg-white"
              }`}
            >
              <CardInDeck
                key={card.id}
                cardId={card.id}
                inDeck={!!deck.find(({ id }) => id === card.id)}
                isNameDuplicate={isNameDuplicate}
                format={state.format}
                toggleCard={() => dispatch(toggleCardAction(card))}
                withAnimation={false}
              />
            </div>
          ) : (
            <span>NONE</span>
          );
        }}
      </FixedVirtualizedList>
    </div>
  );
}

export default FilterableCardLibrary;

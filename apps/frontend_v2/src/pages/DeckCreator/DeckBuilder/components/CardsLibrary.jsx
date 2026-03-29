import { FixedVirtualizedList } from "@components/FixedVirtualizedList";
import { useMemo } from "react";
import { useDeckBuilderDispatcher, useDeckBuilderState } from "../..";
import {
  validateCardForPlayFormat,
  wucards,
  wufactions,
} from "../../../../data/wudb";
import { toggleCardAction } from "../../reducer";
import CardInDeck from "./Card";

function stringTypeToNumber(type) {
  switch (type) {
    case "Objective":
      return 0;
    case "Ploy":
      return 1;
    case "Upgrade":
      return 2;
  }
}

const _sort = (card1, card2) => {
  const t1 = stringTypeToNumber(card1.type);
  const t2 = stringTypeToNumber(card2.type);
  return (
    t1 - t2 || card2.faction - card1.faction || card2.ranking - card1.ranking
  );
};

function FilterableCardLibrary({ searchText, filter }) {
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

    if (isNaN(searchText)) {
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
      <FixedVirtualizedList items={filteredCards}>
        {({ card, expanded, isNameDuplicate }, { key, index }) => {
          return card ? (
            <div
              key={key}
              className={`flex flex-col justify-center pr-2 ${
                index % 2 === 0 ? "bg-purple-100" : "bg-white"
              }`}
            >
              <CardInDeck
                showType
                key={card.id}
                cardId={card.id}
                expanded={expanded}
                inDeck={!!deck.find(({ id }) => id === card.id)}
                isNameDuplicate={isNameDuplicate}
                format={state.format}
                toggleCard={() => dispatch(toggleCardAction(card))}
                withAnimation={false}
                card={card}
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

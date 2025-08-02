import { FixedVirtualizedList } from "@components/FixedVirtualizedList";
import { useEffect, useMemo, useState } from "react";
import { useDeckBuilderDispatcher, useDeckBuilderState } from "../..";
import {
  validateCardForPlayFormat,
  wucards,
  wufactions
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

function FilterableCardLibrary(props) {
  const dispatch = useDeckBuilderDispatcher();
  const [filteredCards, setFilteredCards] = useState([]);
  const state = useDeckBuilderState();
  const { searchText } = props;

  const deck = useMemo(
    () => [
      ...state.selectedObjectives,
      ...state.selectedGambits,
      ...state.selectedUpgrades,
    ],
    [state.selectedObjectives, state.selectedGambits, state.selectedUpgrades],
  );

  useEffect(() => {
    const nextCards = [
      ...Object.values(wucards).filter(
        (card) =>
          !!state.sets.find((set) => set.id == card.setId) &&
          (card.factionId === wufactions["u"].id) 
      ),
    ]
      .filter((card) => {
        return props.filter.test ? props.filter.test(card) : true;
      })
      .filter((card) => {
        const [isValid] = validateCardForPlayFormat(card, state.format);
        return isValid;
      })
      .map((c) => {
        const [, isForsaken, isRestricted] = validateCardForPlayFormat(
          c,
          state.format,
        );
        const card = {
          ...c,
          isBanned: isForsaken,
          isRestricted,
        };

        return card;
      });
    
    let filteredCards = nextCards;

    if (isNaN(searchText)) {
      filteredCards = filteredCards.filter((c) => {
        if (!searchText) return true;

        return (
          c.name.toUpperCase().includes(searchText.toUpperCase()) ||
          c.rule.toUpperCase().includes(searchText.toUpperCase())
        );
      });
    } else {
      filteredCards = filteredCards.filter(({ id }) =>
        `${id}`.padStart(5, "0").includes(searchText),
      );
    }

    const sorted = filteredCards.sort((c1, c2) => _sort(c1, c2));
    const drawableCards = sorted.map((c) => ({ card: c, expanded: false }));
    setFilteredCards(drawableCards);

  }, [state, props.filter, searchText]);

  return (
    <div className="flex-1 flex outline-none">
      <FixedVirtualizedList items={filteredCards}>
        {({ card, expanded }, { key, index }) => {
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

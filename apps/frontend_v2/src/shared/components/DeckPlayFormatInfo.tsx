import React from "react";
import {
  NEMESIS_FORMAT,
  RIVALS_FORMAT
} from "../../data/wudb";

const formatDescriptions: Record<string, string> = {
  [NEMESIS_FORMAT]: `In Nemesis format you can build a deck using cards from two rivals decks, but only one of those rivals decks can contain a plot card.`,
  [RIVALS_FORMAT]: `In Rivals format you can only use cards from a single pre-built rivals deck.`,
};

interface DeckPlayFormatInfoProps extends React.HTMLAttributes<HTMLParagraphElement> {
  format: string;
}

export const DeckPlayFormatInfo = ({ format, ...rest }: DeckPlayFormatInfoProps) => {
  const formatDescription = formatDescriptions[format];

  return formatDescription ? <p {...rest}>{formatDescription}</p> : null;
};

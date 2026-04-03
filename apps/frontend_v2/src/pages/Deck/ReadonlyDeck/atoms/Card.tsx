import { memo } from "react";
import type { CardProps } from "../types";
import { CardAsImage } from "./CardAsImage";
import { CardAsText } from "./CardAsText";

const Card = memo(function Card({ card, asImage, isAlternate }: CardProps) {
  return asImage ? (
    <CardAsImage card={card} />
  ) : (
    <CardAsText card={card} isAlternate={isAlternate} />
  );
});

export default Card;

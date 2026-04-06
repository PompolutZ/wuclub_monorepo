import { Card } from "@fxdxpz/wudb";

export const getCardPathByCardId = (
  card: Card,
  extension: "webp" | "png" | "avif",
) => {
  const folder = card.setId;
  const id = card.id;

  return `/assets/cards/${folder}/${id}.${extension}`;
};

import { Card } from "../data/wudb/types";

export const getCardPathByCardId = (
    card: Card,
    extension: "webp" | "png" | "avif"
) => {
    const folder = card.setId;
    const id = card.id;
    
    return `/assets/cards/${folder}/${id}.${extension}`;
};

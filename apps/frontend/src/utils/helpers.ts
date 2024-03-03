export const getCardPathByCardId = (
    cardId: number,
    extension: "webp" | "png"
) => {
    const folder = Math.floor(cardId / 1000);
    return extension === "webp"
        ? `/assets/cards/${folder}/${cardId}_xs.webp`
        : `/assets/cards/${folder}/${cardId}.png`;
};

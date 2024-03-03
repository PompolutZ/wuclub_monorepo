export const getCardPathByCardId = (
    cardId: number,
    extension: "webp" | "png"
) => {
    const folder = Math.floor(cardId / 1000);
    const id = `${cardId}`.padStart(5, "0");
    return extension === "webp"
        ? `/assets/cards/${folder}/${id}_xs.webp`
        : `/assets/cards/${folder}/${id}.png`;
};

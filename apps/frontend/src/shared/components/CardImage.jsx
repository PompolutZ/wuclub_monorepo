import { getCardPathByCardId } from "../../utils/helpers";

function CardImage({ id, ...rest }) {
  const cardId = typeof id !== "string" ? String(id).padStart(5, "0") : id;
  return (
    <picture>
      <source type="image/webp" srcSet={getCardPathByCardId(cardId, "webp")} />
      <img src={getCardPathByCardId(cardId, "png")} {...rest} />
    </picture>
  );
}

export default CardImage;

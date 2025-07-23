import { cards } from "../../data/wudb/cards";
import { getCardPathByCardId } from "../../utils/helpers";

function CardImage({ id, ...rest }) {
  const cardId = typeof id !== "string" ? String(id).padStart(5, "0") : id;
  const card = cards[cardId];
  return (
    <picture>
      <source type="image/webp" srcSet={getCardPathByCardId(card, "webp")} />
      <img src={getCardPathByCardId(card, "png")} {...rest} />
    </picture>
  );
}

export default CardImage;

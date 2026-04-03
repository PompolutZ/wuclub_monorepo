import { cards } from "../../data/wudb/cards";
import { getCardPathByCardId } from "../../utils/helpers";

interface CardImageProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "id"
> {
  id: string | number;
}

function CardImage({ id, ...rest }: CardImageProps) {
  const cardId = typeof id !== "string" ? String(id).padStart(5, "0") : id;
  const card = cards[cardId as keyof typeof cards];
  return (
    <picture>
      <source type="image/webp" srcSet={getCardPathByCardId(card, "webp")} />
      <img src={getCardPathByCardId(card, "png")} {...rest} />
    </picture>
  );
}

export default CardImage;

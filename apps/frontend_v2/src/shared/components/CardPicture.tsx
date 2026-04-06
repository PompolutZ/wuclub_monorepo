import { Card } from "@fxdxpz/wudb";
import { getCardPathByCardId } from "../../utils/helpers";

type CardPictureProps = {
  card: Card;
  imgClassName?: string;
};

export const CardPicture = ({ card, imgClassName }: CardPictureProps) => {
  return (
    <picture className="max-h-full max-w-full flex">
      <source type="image/avif" srcSet={getCardPathByCardId(card, "avif")} />
      <source type="image/webp" srcSet={getCardPathByCardId(card, "webp")} />
      <img
        className={`relative object-contain cursor-pointer ${imgClassName ?? ""}`}
        alt={card.name}
        src={getCardPathByCardId(card, "png")}
      />
    </picture>
  );
};

import { Card } from "../../data/wudb/types";
import { getCardPathByCardId } from "../../utils/helpers";

type CardPictureProps = {
    card: Card;
};

export const CardPicture = ({ card }: CardPictureProps) => {
    return (
        <picture className="max-h-full max-w-full flex">
            <source
                type="image/avif"
                srcSet={getCardPathByCardId(card, "avif")}
            />
            <source
                type="image/webp"
                srcSet={getCardPathByCardId(card, "webp")}
            />
            <img
                className="relative object-contain cursor-pointer transform hover:scale-105 transition-all hover:z-10 filter hover:drop-shadow-lg"
                alt={card.name}
                src={getCardPathByCardId(card, "png")}
            />
        </picture>
    );
}

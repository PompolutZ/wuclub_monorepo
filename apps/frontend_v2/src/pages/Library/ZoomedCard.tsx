import { Card } from "@fxdxpz/wudb";
import { ModalPresenter } from "../../main";
import { CardPicture } from "../../shared/components/CardPicture";

export const ZoomedCard = ({
  card,
  rect,
  isZoomAnimating,
  onClose,
}: {
  card: Card;
  rect: DOMRect;
  onClose: () => void;
  isZoomAnimating: boolean;
}) => {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = window.innerWidth / 2 - centerX;
  const dy = window.innerHeight / 2 - centerY;
  const transform = isZoomAnimating
    ? `translate(${dx}px, ${dy}px) scale(1.7)`
    : "translate(0, 0) scale(1)";
  return (
    <ModalPresenter>
      <div className="fixed inset-0 z-40" onClick={onClose}>
        <div
          className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-all duration-300 ${isZoomAnimating ? "opacity-100" : "opacity-0"}`}
        />
      </div>
      <div
        className="fixed z-50 p-2 flex items-center justify-center transition-transform duration-300 ease-out pointer-events-none"
        style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          transform,
        }}
      >
        <CardPicture card={card} />
      </div>
    </ModalPresenter>
  );
};

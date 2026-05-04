import type { Board } from "../../../../../shared/boards";

type BoardPictureProps = {
  board: Board;
  imgClassName?: string;
};

export const BoardPicture = ({ board, imgClassName }: BoardPictureProps) => {
  const path = `/assets/boards/${board.asset}`;
  return (
    <picture>
      <source type="image/avif" srcSet={`${path}.avif`} />
      <source type="image/webp" srcSet={`${path}.webp`} />
      <img
        alt={board.name}
        src={`${path}.png`}
        className={imgClassName}
        draggable={false}
      />
    </picture>
  );
};

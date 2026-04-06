type CardBackProps = {
  type: "objectives" | "power";
  className?: string;
};

export const CardBack = ({ type, className }: CardBackProps) => {
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={`/assets/cards/${type}_back.avif`} />
      <source type="image/webp" srcSet={`/assets/cards/${type}_back.webp`} />
      <img
        className="w-full rounded-sm"
        src={`/assets/cards/${type}_back.png`}
        alt={`${type} card back`}
      />
    </picture>
  );
};

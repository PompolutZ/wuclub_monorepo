type ExpansionPictureProps = {
  setName: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export const ExpansionPicture = ({ setName, ...rest }: ExpansionPictureProps) => {
  return (
    <picture>
      <source type="image/webp" srcSet={`/assets/icons/decks/${setName}.webp`} />
      <source type="image/avif" srcSet={`/assets/icons/decks/${setName}.avif`} />
      <img
        src={`/assets/icons/decks/${setName}.png`}
        alt={`${setName}`}
        {...rest}
      />
    </picture>
  );
}
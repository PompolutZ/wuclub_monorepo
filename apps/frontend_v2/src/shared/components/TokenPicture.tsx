import type { ImgHTMLAttributes } from "react";

// `src` is the asset path without an extension. The component renders both the
// webp source and the png fallback.
type TokenPictureProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
};

export const TokenPicture = ({ src, ...imgProps }: TokenPictureProps) => {
  return (
    <picture>
      <source type="image/webp" srcSet={`${src}.webp`} />
      <img src={`${src}.png`} {...imgProps} />
    </picture>
  );
};

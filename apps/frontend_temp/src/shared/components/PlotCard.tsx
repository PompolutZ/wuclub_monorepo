export const PlotCard = ({ set }: { set: string }) => {
  return (
    <picture>
      <source type="image/avif" srcSet={`/assets/cards/${set}/${set}Plot.avif`} />
      <source type="image/webp" srcSet={`/assets/cards/${set}/${set}Plot.webp`} />
      <img
        src={`/assets/cards/${set}/${set}Plot.png`}
        alt="Plot card"
        className="rounded-xl"
      />
    </picture>
  );
};

export const PlotCard = ({ asset }: { asset: string }) => {
  return (
    <picture>
      <source type="image/webp" srcSet={`/assets/plots/${asset}.webp`} />
      <img
        src={`/assets/plots/${asset}.png`}
        alt="Plot card"
        className="rounded-xl"
      />
    </picture>
  );
};

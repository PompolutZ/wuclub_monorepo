import { getSetNameById } from "@/data/wudb";

type Props = {
  id: string;
  setId: number;
};

export const SetIcon = ({ id, setId }: Props) => (
  <picture>
    <source
      type="image/webp"
      srcSet={`/assets/icons/${getSetNameById(setId)}-icon.webp`}
    />
    <img
      className={`w-4 h-4 -ml-1 mr-2`}
      id={id}
      src={`/assets/icons/${getSetNameById(setId)}-icon-24.png`}
      alt="icon"
    />
  </picture>
);

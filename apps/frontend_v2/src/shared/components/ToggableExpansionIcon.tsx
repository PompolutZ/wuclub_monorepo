import { ExpansionPicture } from "./ExpansionPicture";

interface ToggableExpansionIconProps {
  set: string;
  isEnabled: boolean;
  onClick: (set: string) => void;
}

export const ToggableExpansionIcon = ({
  set,
  isEnabled,
  onClick,
}: ToggableExpansionIconProps) => {
  return (
    <div
      className={`cursor-pointer ${isEnabled ? "opacity-100" : "opacity-20"}`}
      onClick={() => onClick(set)}
    >
      <ExpansionPicture setName={set} className="w-12 h-12" />
    </div>
  );
};

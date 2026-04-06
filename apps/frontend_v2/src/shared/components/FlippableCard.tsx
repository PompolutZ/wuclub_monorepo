import { animated as a, useSpring } from "@react-spring/web";
import type { ReactNode } from "react";

type FlippableCardProps = {
  front: ReactNode;
  back: ReactNode;
  flipped: boolean;
  onFlip: () => void;
};

export const FlippableCard = ({
  front,
  back,
  flipped,
  onFlip,
}: FlippableCardProps) => {
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  return (
    <div className="grid cursor-pointer" onClick={onFlip}>
      <a.div
        className="row-start-1 col-start-1"
        style={{ opacity: opacity.to((o) => 1 - o), transform }}
      >
        {back}
      </a.div>
      <a.div
        className="row-start-1 col-start-1"
        style={{
          opacity,
          transform: transform.to((t) => `${t} rotateY(180deg)`),
        }}
      >
        {front}
      </a.div>
    </div>
  );
};

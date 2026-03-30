import ClockIcon from "@icons/clock.svg?react";
import HourglassIcon from "@icons/hourglass-2.svg?react";
import ZapIcon from "@icons/zap.svg?react";

interface ScoreIconProps {
  scoreType: "Surge" | "End" | "Third";
  classes?: string;
}

function ScoreIcon({ scoreType, classes }: ScoreIconProps) {
    switch (scoreType) {
        case "Surge":
            return <ZapIcon className={`${classes}`} />;
        case "End":
            return <ClockIcon className={`${classes}`} />;
        case "Third":
            return <HourglassIcon className={`fill-current ${classes}`} />;
        default:
            return null;
    }
}

export default ScoreIcon

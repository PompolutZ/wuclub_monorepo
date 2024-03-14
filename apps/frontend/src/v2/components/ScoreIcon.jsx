import React from 'react'
import ClockIcon from "@icons/clock.svg?react";
import HourglassIcon from "@icons/hourglass-2.svg?react";
import ZapIcon from "@icons/zap.svg?react";

function ScoreIcon({ scoreType, classes, ...rest }) {
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

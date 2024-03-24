import React from "react";
import SheduleIcon from "@icons/clock.svg?react";
import FlashOnIcon from "@icons/zap.svg?react";
import HourglassEmptyIcon from "@icons/hourglass-2.svg?react";
import HourglassFullIcon from "@icons/hourglass-2.svg?react";

const ObjectiveScoreTypeIcon = ({ type, style }) => {
    switch (type) {
        case 0:
        case 'Surge':
            return <FlashOnIcon style={style} />;
        case 1:
        case 'End':
            return <SheduleIcon style={style} />;
        case 2:
            return <HourglassFullIcon style={style} />;
        case 3:
        case 'Third':
            return <HourglassEmptyIcon style={style} />;
        default:
            return null;
    }
};

export default ObjectiveScoreTypeIcon;

import React from "react";
import SheduleIcon from "@icons/clock.svg?react";
import FlashOnIcon from "@icons/zap.svg?react";
import HourglassFullIcon from "@icons/hourglass-2.svg?react";

import GloryIcon from '@icons/wu-glory.svg?react';

function ScoringOverview({ summary: { Surge, End, Third }, glory }) {
    return (
        <div className="flex items-center text-sm text-gray-800">
            (
            {Surge > 0 && (
                <div className="flex items-center mr-2">
                    <FlashOnIcon
                        className="stroke-current"
                        // setting size via tailwind doesn't work :(
                        style={{ width: "1rem", height: "1rem" }}
                    />
                    {Surge}
                </div>
            )}
            {End > 0 && (
                <div className="flex items-center mr-2">
                    <SheduleIcon
                        className="stroke-current"
                        // setting size via tailwind doesn't work :(
                        style={{ width: "1rem", height: "1rem" }}
                    />
                    {End}
                </div>
            )}
            {Third > 0 && (
                <div className="flex items-center">
                    <HourglassFullIcon
                        className="stroke-current"
                        // setting size via tailwind doesn't work :(
                        style={{ width: "1rem", height: "1rem" }}
                    />
                    {Third}
                </div>
            )}
            )
            <div className="flex items-center ml-2"
            >
                <GloryIcon className="bg-objective-gold rounded-full w-5 h-5 fill-current" />

                {glory}
            </div>
        </div>
    );
}

export default ScoringOverview;

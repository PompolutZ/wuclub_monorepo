import React from 'react';
import PrimacyIcon from "@icons/Primacy.svg?react";
import HunterIcon from "@icons/Hunter.svg?react";
import QuarryIcon from "@icons/Quarry.svg?react";

export const KEYWORD_FILTERS = [
    {
        label: "Primacy",
        icon: <PrimacyIcon className="w-6 h-6 mx-auto fill-current" />,
        filter: card => card.rule.includes('Primacy'),
    },
    {
        label: "Hunter",
        icon: <HunterIcon className="w-6 h-6 mx-auto fill-current" />,
        filter: card => card.rule.includes('Hunter'),
    },
    {
        label: "Quarry",
        icon: <QuarryIcon className="w-6 h-6 mx-auto fill-current" />,
        filter: card => card.rule.includes('Quarry'),
    },
];

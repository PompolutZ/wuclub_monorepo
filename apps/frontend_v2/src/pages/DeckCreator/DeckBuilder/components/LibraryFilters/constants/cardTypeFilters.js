export const CARD_TYPE_FILTERS = [
    {
        label: "Objective",
        filter: card => card.type === 'Objective',
    },
    {
        label: "Gambit",
        filter: card => card.type === 'Ploy',
    },
    {
        label: "Upgrade",
        filter: card => card.type === 'Upgrade',
    },
]
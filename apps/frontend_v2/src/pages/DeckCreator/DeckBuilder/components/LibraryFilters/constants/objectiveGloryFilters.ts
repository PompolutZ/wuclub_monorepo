import type { FilterConfig } from "./cardTypeFilters";

export const OBJECTIVE_GLORY_FILTERS: FilterConfig[] = [
    {
        label: "1",
        filter: card => card.glory === 1,
    },
    {
        label: "2",
        filter: card => card.glory === 2,
    },
    {
        label: "3",
        filter: card => card.glory === 3,
    },
    {
        label: "4+",
        filter: card => (card.glory ?? 0) >= 4,
    },
]
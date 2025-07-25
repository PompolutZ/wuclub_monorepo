export type Card = {
    id: string;
    factionId: string;
    setId: string;
    name: string;
    type: string;
    glory: number | null;
    rule: string;
    scoreType: string;
    status: string;
    rotated: boolean;
}

export type Set = {
    id: string;
    name: string;
    displayName: string;
}

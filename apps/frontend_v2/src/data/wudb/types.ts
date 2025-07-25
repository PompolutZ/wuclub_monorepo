import { cards } from "./cards";
import { factions } from "./factions"
import { sets } from "./sets";

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

export type CardId = keyof typeof cards;
export type SetId = (typeof sets)[keyof typeof sets]["id"];
export type FactionName = typeof factions[keyof typeof factions]["name"]
export type FactionAbbr = typeof factions[keyof typeof factions]["abbr"]

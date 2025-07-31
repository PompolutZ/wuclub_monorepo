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

export type CardType = (typeof cards)[keyof typeof cards]["type"];
export type ScoreType = (typeof cards)[keyof typeof cards]["scoreType"];
export type CardId = keyof typeof cards;
export type SetId = (typeof sets)[keyof typeof sets]["id"];
export type FactionName = typeof factions[keyof typeof factions]["name"]
export type FactionAbbr = typeof factions[keyof typeof factions]["abbr"]

export type Deck = {
    deckId: string;
    deck: CardId[];
    faction: string;
    name: string;
    private: boolean;
    sets: SetId[];
    fuid: string;
    createdutc: number;
    updatedutc: number;
    edition?: number | undefined;
}

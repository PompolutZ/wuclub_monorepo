import { readdir, readFile, writeFile } from 'node:fs/promises';
import { factionIdPrefix, factionToGrandAlianceId, setsNames } from './meta';
import { dashify, decodeUDB, factionNames, findDuplicatesByName } from './utils';

interface WUDB {
    sets: Record<string, Set>;
    factions: Record<string, Faction>;
    cards: Record<string, Card>;
}

interface Set {
    id: string;
    name: string;
    displayName: string;
}

interface Faction {
    id: string;
    abbr: string;
    name: string;
    gaId: number;
    displayName: string;
}

interface Card {
    id: string;
    factionId: string;
    setId: string;
    name: string;
    type: string;
    glory: number;
    rule: string;
    scoreType: string;
    status: string;
    rotated: boolean;
    duplicates?: string[];
}

async function readFiles() {
    try {
        const files = await readdir('./sheets');
        console.log(files.slice(1));

        let sets = {};
        let cards = {};

        for (let file of files.slice(1)) {
            let content = await readFile(`./sheets/${file}`, { encoding: 'utf-8'})
            const parsed = parse(content);
            sets = {
                ...sets,
                ...parsed.sets,
            }

            cards = {
                ...cards,
                ...parsed.cards,
            }
        }

        // const factions = factionNames.reduce((acc: Record<string, Faction>, faction: string) => {
        //     const dashified = dashify(faction);
        //     acc[factionIdPrefix[dashified]] = {
        //         id: factionIdPrefix[dashified],
        //         abbr: factionIdPrefix[dashified],
        //         name: dashified,
        //         displayName: faction,
        //         gaId: factionToGrandAlianceId[dashified],
        //     }

        //     return acc;
        // }, {})

        let setsStr = serialize(sets, "sets");
        //let factionsStr = serialize(factions, "factions");
        let cardsStr = serialize(cards, "cards");

        await writeFile(new URL('../dist/cards.ts', import.meta.url), `${cardsStr} as const;`);
        //await writeFile(new URL('../dist/factions.ts', import.meta.url), `${factionsStr} as const;`);
        await writeFile(new URL('../dist/sets.ts', import.meta.url), `${setsStr} as const;`);
        
    } catch (e) {
        console.error(e);
    }
}

await readFiles();

function toLines(str: string): string[] { return str.split('\n'); }

function serialize(data: unknown, name: string): string {
    return `export const ${name} = ` + JSON.stringify(data, null, 4);
}

function parse(text: string): WUDB {
    const wudb: WUDB = {
        sets: {},
        factions: {},
        cards: {},
    }

    return toLines(text).slice(1).map(line => line.split('\t')).reduce(
        (acc, line, i) => {

            // let [release,,number,,,,,name,faction,type,glory,description,,otype,,set,status,OP,,F,R,FR,rotated, ...rest] = []
            // if (i > 3155) {
            //     [release,,number,name,faction,type,glory,,,,,description,,otype,,set,status,OP,,F,R,FR,rotated, ...rest] = line;
            // } else if(line.length > 22) {
            //     [release,,number,,,,,name,faction,type,glory,description,,otype,,set,status,OP,,F,R,FR,rotated, ...rest] = line;
            // } else {
            //     [release,,number,name,faction,type,glory,description,,otype,,set,status,OP,,F,R,FR,rotated, ...rest] = line;
            // }
            let [release] = line;
            if (release !== "Embergard") return acc;

            let [,,udbIndex,,,,,name,faction,type,glory,description,,otype,,set,status,OP,,F,R,FR,rotated, ...rest] = line;
            console.log("Parsing line > ", i);
            if(name == '-') return acc;
            // populate sets table

            if (faction !== "Universal") throw new Error("Found non-universal faction > " + faction);

            let [,prefix,, id] = decodeUDB(udbIndex);
            
            if(!acc.sets[prefix]) {
                if(!prefix) {
                    console.log(line);
                    throw Error(`Cannot find index for > ${set}`);
                }

                acc.sets[prefix] = {
                    id: prefix,
                    name: dashify(set),
                    displayName: set
                }
            }

            // if(!acc.factions[faction]) {
            //     const index = getFaction(faction);
            //     console.log(faction, index, factionIndexes[index])
            //     if(index < 0) throw Error(`Cannot find faction for > ${faction} in line: ${JSON.stringify(line)}`);
            //     const factionKebab = factionIndexes[index];

            //     acc.factions[faction] = {
            //         id: index + 1,
            //         abbr: factionIdPrefix[factionKebab],
            //         name: factionKebab,
            //         gaId: factionToGrandAlianceId[factionKebab],
            //         displayName: faction
            //     }
            // }
            
            const duplicates = findDuplicatesByName(name, acc.cards);
            let data;
            
            if(!acc.cards[id]) {
                const setId = prefix;
                if (!setId) {
                    console.error("HELLO", set);
                    throw new Error();
                }

                const factionId = factionIdPrefix[dashify(faction)];
                if(!factionId) {
                    throw new Error(`Cannot find faction for > ${faction}\r\nLooking for ${dashify(faction)}`);
                }
                data = {
                    id,
                    factionId,
                    setId,
                    name,
                    type,
                    glory: Number(glory) || NaN,
                    rule: description,
                    scoreType: otype,
                    // Status has the format XXX_XX_X
                    // First tripplet describes whether cards is valid for Championship fornat, 
                    // which could be V | N | R(otated) 
                    // is it Forsaken?, is it Restricted?
                    // _______________________________
                    // Then double describes if card is valid for Relic format, is it Forsaken?
                    // _______________________________
                    // Last single stands for Open format. 
                    status: `${OP[0]}${(F != '-' && F !== '') ? 'Y' : '-'}${(R != '-' && R !== '') ? 'Y' : '-'}_${OP[1]}${(FR != '-' && FR !== '') ? 'Y' : '-'}_${OP[2]}`,
                    rotated: rotated != '-',
                };

                acc.cards[id] = data
            }

            if(duplicates.length > 0) {
                const updatedWithDuplicatesInfo = 
                    [...duplicates, [id, data]].reduce((update, [cardKey, cardData]) => ({
                        ...update,
                        [cardKey]: {
                            ...cardData,
                            duplicates: [...duplicates.map(([,data]) => data.id), id]
                        }
                    }), {})
                acc.cards = {...acc.cards, ...updatedWithDuplicatesInfo}
            }

            return acc;
        }, wudb);
}

function getSetIndex(name: string): number {
    switch(name) {
        case "Gnarlspirit Pack Rivals Deck":
        case "Sons of Velmorn Rivals Deck":
            return setsNames.indexOf("Gnarlwood core set");
        case "Grinkrak's Looncourt Rivals Deck":
            return setsNames.indexOf("Grinkrak's Looncourt expansion");
        case "Gryselle's Arenai Rivals Deck":
            return setsNames.indexOf("Gryselle's Arenai expansion");
        default:
            return setsNames.indexOf(name);
    }
} 
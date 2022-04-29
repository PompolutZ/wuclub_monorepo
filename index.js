import {readFileSync, writeFileSync} from 'fs';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { setsNames, setsIndex, factionIndexes, factionIdPrefix, factionToGrandAlianceId } from './meta.mjs';
import { getFaction, findDuplicatesByName, decodeUDB } from './utils.mjs';

async function readFiles() {
    try {
        const files = await readdir('./sheets');
        console.log(files.slice(1));

        let sets = {};
        let factions = {};
        let cards = {};

        for (let file of files.slice(1)) {
            let content = await readFile(`./sheets/${file}`, { encoding: 'utf-8'})
            const parsed = parse(content);
            sets = {
                ...sets,
                ...parsed.sets,
            }

            factions = {
                ...factions,
                ...parsed.factions,
            }

            cards = {
                ...cards,
                ...parsed.cards,
            }
        }

        // const { sets, factions, cards } = parse(tsvFile)
        let setsStr = serialize(sets, "sets");
        let factionsStr = serialize(factions, "factions");
        let cardsStr = serialize(cards, "cards");
        let preBeastgraveCards = Object.entries(cards).filter(([id]) => id < 6000).reduce((cards, [cardId, cardData]) => ({ ...cards, [cardId]: cardData }), {});
        let afterBeastgraveCards = Object.entries(cards).filter(([id]) => id > 6000).reduce((cards, [cardId, cardData]) => ({ ...cards, [cardId]: cardData }), {});
        const cardsWithOldIds = Object.entries(cards).reduce((acc, [k, { factionId, rule, ...rest}]) => {
            const primacy = rule.toUpperCase().includes("PRIMACY");
            const faction = Object.values(factions).find(f => f.id === factionId).name;
            const oldFormatId = k.padStart(5, "0");
            return {
                ...acc,
                [oldFormatId]: {
                    ...rest,
                    factionId,
                    rule,
                    primacy,
                    faction,
                }
            }
        }, {})
        
        let cardsClub = serialize(cardsWithOldIds, "cardsDb");
        writeFileSync(new URL('dist/wudb.js', import.meta.url), `${setsStr}\n${factionsStr}\n${cardsStr}\n`);
        writeFileSync(new URL('dist/chunked/sets.js', import.meta.url), setsStr);
        writeFileSync(new URL('dist/chunked/factions.js', import.meta.url), factionsStr);
        writeFileSync(new URL('dist/chunked/cards-archive.js', import.meta.url), serialize(preBeastgraveCards, "cards"));
        writeFileSync(new URL('dist/chunked/cards.js', import.meta.url), serialize(afterBeastgraveCards, "cards"));
        writeFileSync(new URL('dist/cardsDb.js', import.meta.url), cardsClub);
        
    } catch (e) {
        console.error(e);
    }
}

readFiles();

// const [,,fileName] = process.argv;
// console.log(fileName);
// const hasClubFlag = process.argv?.includes("--club");
// const fileNames = fileName.split(',');

// //const tsvFile = readFileSync(new URL(fileName, import.meta.url), "utf-8");

const toLines = str => str.split('\n');

// let parsed;
// if(hasClubFlag) {
//     const tsvFile = readFileSync(new URL(fileNames[0], import.meta.url), "utf-8");
//     parsed = parseAsClub(tsvFile);
//     let data = "export const cardsDb = " + JSON.stringify(parsed, null, 4);
//     writeFileSync(new URL('dist/cardsDb.js', import.meta.url), data);
// } else {
// }

function serialize(data, name) {
    return `export const ${name} = ` + JSON.stringify(data, null, 4);
}

// function parseAsClub(text) {
//     return toLines(text).slice(1).map(line => line.split('\t')).reduce(
//         (acc, [release,,number,,,,,name,faction,type,glory,description,,otype,,set,status, OP,,F,R,FR,rotated, ...rest], i) => {
//             console.log("Parsing line > ", i);
//             if(name == '-') return acc;
//             // populate sets table
//             // const duplicates = findDuplicatesByName(name, acc);
//             let data;

//             const index = getFaction(faction);
//             if(index < 0) throw Error(`Cannot find faction for > ${faction}`);
//             const factionKebab = factionIndexes[index];

//             const primacy = description.toUpperCase().includes("PRIMACY");
            
//             let id = decodeUDB(number);
//             let oldId = String(id).padStart(5, "0");
            
//             if(!acc[oldId]) {
//                 const factionId = getFaction(faction) + 1;
//                 const setId = setsNames.indexOf(set) + 1;

//                 data = {
//                     id,
//                     factionId,
//                     faction: factionKebab,
//                     setId,
//                     name,
//                     type,
//                     glory: Number(glory) || NaN,
//                     rule: description,
//                     scoreType: otype,
//                     status: `${OP[0]}${F != '-' ? 'Y' : '-'}${R != '-' ? 'Y' : '-'}_${OP[1]}${FR != '-' ? 'Y' : '-'}_${OP[2]}`,
//                     rotated: rotated != '-',
//                     primacy,
//                 };

//                 acc[oldId] = data
//             }

//             // if(duplicates.length > 0) {
//             //     const updatedWithDuplicatesInfo = 
//             //         [...duplicates, [id, data]].reduce((update, [cardKey, cardData]) => ({
//             //             ...update,
//             //             [cardKey]: {
//             //                 ...cardData,
//             //                 duplicates: [...duplicates.map(([,data]) => data.id), id]
//             //             }
//             //         }), {})
//             //     acc = {...acc, ...updatedWithDuplicatesInfo}
//             // }

//             return acc;
//         }, {});
// }

function parse(text) {
    const wudb = {
        sets: {},
        factions: {},
        cards: {},
    }

    return toLines(text).slice(1).map(line => line.split('\t')).reduce(
        (acc, line, i) => {
            let [release,,number,,,,,name,faction,type,glory,description,,otype,,set,status,OP,,F,R,FR,rotated, ...rest] = []
            if(line.length > 22) {
                [release,,number,,,,,name,faction,type,glory,description,,otype,,set,status,OP,,F,R,FR,rotated, ...rest] = line;
            } else {
                [release,,number,name,faction,type,glory,description,,otype,,set,status,OP,,F,R,FR,rotated, ...rest] = line;
            }
            console.log("Parsing line > ", i);
            if(name == '-') return acc;
            // populate sets table
            if(!acc.sets[set]) {
                const index = setsNames.indexOf(set);
                if(index < 0) {
                    console.log(line);
                    throw Error(`Cannot find index for > ${set}`);
                }

                acc.sets[set] = {
                    id: index + 1,
                    name: setsIndex[index],
                    displayName: set
                }
            }

            if(!acc.factions[faction]) {
                const index = getFaction(faction);
                console.log(faction, index, factionIndexes[index])
                if(index < 0) throw Error(`Cannot find faction for > ${faction}`);
                const factionKebab = factionIndexes[index];

                acc.factions[faction] = {
                    id: index + 1,
                    abbr: factionIdPrefix[factionKebab],
                    name: factionKebab,
                    gaId: factionToGrandAlianceId[factionKebab],
                    displayName: faction
                }
            }
            
            const duplicates = findDuplicatesByName(name, acc.cards);
            let data;
            
            let id = decodeUDB(number);
            
            if(!acc.cards[id]) {
                const factionId = getFaction(faction) + 1;
                const setId = setsNames.indexOf(set) + 1;

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

// //
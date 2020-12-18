const fs = require('fs');
const path = require('path');

const setsIndex = [
    // SHADESPIRE
    "shadespire-core", // 0
    "sepulchral-guard",
    "ironskulls-boyz",
    "the-chosen-axes",
    "spiteclaws-swarm",
    "magores-fiends",
    "the-farstriders",
    "leaders", // 7

    // NIGHTVAULT

    "nightvault-core", // 8
    "the-eyes-of-the-nine",
    "zarbags-gitz",
    "garreks-reavers",
    "steelhearts-champions",
    "echoes-of-glory", // 13
    "godsworn-hunt",
    "mollogs-mob",
    "thundriks-profiteers",
    "yltharis-guardians", // 17
    "powers-unbound", // 18
    
    
    // DREADFANE
    "dreadfane", // 19

    // BEASTGRAVE
    "beastgrave-core", // 20
    "the-grymwatch", // 21
    "rippas-snarlfangs", // 22
    "hrothgorns-mantrappers", // 24
    "the-wurmspat", // 25
    "morgwaeths-blade-coven", // 26
    "morgoks-krushas", // 27
    "beastgrave-gift-pack", // 23
    "arena-mortis", // 28

    "direchasm-core",
]

const setsNames = [
    // SHADESPIRE
    "Core set", // 0
    "Sepulchral Guard expansion",
    "Ironskull's Boyz expansion",
    "The Chosen Axes expansion",
    "Spiteclaw's Swarm expansion",
    "Magore's Fiends expansion",
    "The Farstriders expansion",
    "Leaders", // 7

    // NIGHTVAULT

    "Nightvault core set", // 8
    "The Eyes of the Nine expansion",
    "Zarbag's Gitz expansion",
    "Garrek's Reavers expansion",
    "Steelheart's Champions expansion",
    "Echoes Of Glory Expansion Card Set", // 13
    "Godsworn Hunt expansion",
    "Mollog's Mob expansion",
    "Thundrik's Profiteers expansion",
    "Ylthari's Guardians expansion",
    "Power Unbound", // 18

    // DREADFANE
    "Dreadfane", // 19

    // BEASTGRAVE
    "Beastgrave core set", // 20
    "The Grymwatch expansion", // 21
    "Rippa's Snarlfangs expansion", // 22
    "The Wurmspat expansion", // 23
    "Hrothgorn's Mantrappers expansion", // 24
    "Morgwaeth's Blade Coven expansion", // 25
    "Morgok's Krushas expansion", // 26
    "Beastgrave Gift Pack expansion", // 27
    "Arena Mortis expansion", // 28
    
    // DIRECHASM
    "Direchasm core set", // 29
]

const sets = {
    "Core set": {
        "id": 1,
        "name": "shadespire-core",
        "displayName": "Core set"
    },
    "Sepulchral Guard expansion": {
        "id": 2,
        "name": "sepulchral-guard",
        "displayName": "Sepulchral Guard expansion"
    },
    "Ironskull's Boyz expansion": {
        "id": 3,
        "name": "ironskulls-boyz",
        "displayName": "Ironskull's Boyz expansion"
    },
    "The Chosen Axes expansion": {
        "id": 4,
        "name": "the-chosen-axes",
        "displayName": "The Chosen Axes expansion"
    },
    "Spiteclaw's Swarm expansion": {
        "id": 5,
        "name": "spiteclaws-swarm",
        "displayName": "Spiteclaw's Swarm expansion"
    },
    "Magore's Fiends expansion": {
        "id": 6,
        "name": "magores-fiends",
        "displayName": "Magore's Fiends expansion"
    },
    "The Farstriders expansion": {
        "id": 7,
        "name": "the-farstriders",
        "displayName": "The Farstriders expansion"
    },
    "Leaders": {
        "id": 8,
        "name": "leaders",
        "displayName": "Leaders"
    },
    "Nightvault core set": {
        "id": 9,
        "name": "nightvault-core",
        "displayName": "Nightvault core set"
    },
    "The Eyes of the Nine expansion": {
        "id": 10,
        "name": "the-eyes-of-the-nine",
        "displayName": "The Eyes of the Nine expansion"
    },
    "Zarbag's Gitz expansion": {
        "id": 11,
        "name": "zarbags-gitz",
        "displayName": "Zarbag's Gitz expansion"
    },
    "Garrek's Reavers expansion": {
        "id": 12,
        "name": "garreks-reavers",
        "displayName": "Garrek's Reavers expansion"
    },
    "Steelheart's Champions expansion": {
        "id": 13,
        "name": "steelhearts-champions",
        "displayName": "Steelheart's Champions expansion"
    },
    "Godsworn Hunt expansion": {
        "id": 15,
        "name": "godsworn-hunt",
        "displayName": "Godsworn Hunt expansion"
    },
    "Mollog's Mob expansion": {
        "id": 16,
        "name": "mollogs-mob",
        "displayName": "Mollog's Mob expansion"
    },
    "Thundrik's Profiteers expansion": {
        "id": 17,
        "name": "thundriks-profiteers",
        "displayName": "Thundrik's Profiteers expansion"
    },
    "Ylthari's Guardians expansion": {
        "id": 18,
        "name": "yltharis-guardians",
        "displayName": "Ylthari's Guardians expansion"
    },
    "Power Unbound": {
        "id": 19,
        "name": "powers-unbound",
        "displayName": "Power Unbound"
    },
    "Dreadfane": {
        "id": 20,
        "name": "dreadfane",
        "displayName": "Dreadfane"
    },
    "Beastgrave core set": {
        "id": 21,
        "name": "beastgrave-core",
        "displayName": "Beastgrave core set"
    },
    "The Grymwatch expansion": {
        "id": 22,
        "name": "the-grymwatch",
        "displayName": "The Grymwatch expansion"
    },
    "Rippa's Snarlfangs expansion": {
        "id": 23,
        "name": "rippas-snarlfangs",
        "displayName": "Rippa's Snarlfangs expansion"
    },
    "The Wurmspat expansion": {
        "id": 24,
        "name": "beastgrave-gift-pack",
        "displayName": "The Wurmspat expansion"
    },
    "Hrothgorn's Mantrappers expansion": {
        "id": 25,
        "name": "hrothgorns-mantrappers",
        "displayName": "Hrothgorn's Mantrappers expansion"
    },
    "Morgwaeth's Blade Coven expansion": {
        "id": 26,
        "name": "the-wurmspat",
        "displayName": "Morgwaeth's Blade Coven expansion"
    },
    "Morgok's Krushas expansion": {
        "id": 27,
        "name": "morgwaeths-blade-coven",
        "displayName": "Morgok's Krushas expansion"
    },
    "Beastgrave Gift Pack expansion": {
        "id": 28,
        "name": "morgoks-krushas",
        "displayName": "Beastgrave Gift Pack expansion"
    },
    "Arena Mortis expansion": {
        "id": 29,
        "name": "arena-mortis",
        "displayName": "Arena Mortis expansion"
    }
}


const [,,fileName] = process.argv;
const tsvFile = fs.readFileSync(path.join(__dirname, fileName), 'utf8');

const toLines = str => str.split('\n');

const getScoreType = text => {
    if(text.includes('Score this immediately'))
        return 0;

    if(text.includes('Score this in an end phase'))
        return 1;
        
    if(text.includes('Score this in the third end'))    
        return 2;
}

const getType = text => {
    switch(text) {
        case "Objective": return 0;
        case "Ploy": return 1;
        case "Upgrade": return 2;
        case "Spell": return 3;
        default: return -1;
    }
}

const getFaction = text => {
    switch(text) {
        case "Universal": return 0;
        case "Garrek's Reavers": return 1;
        case "Steelheart's Champions": return 2;
        case "Sepulchral Guard": return 3;
        case "Ironskull's Boyz": return 4;
        case "The Chosen Axes": return 5;
        case "Spiteclaw's Swarm": return 6;
        case "Magore's Fiends": return 7;
        case "The Farstriders": return 8;
        case "Stormsire's Cursebreakers": return 9;
        case "Thorns of the Briar Queen": return 10;
        case "The Eyes of the Nine": return 11;
        case "Zarbag's Gitz": return 12;
        case "Godsworn Hunt": return 13;
        case "Mollog's Mob": return 14;
        case "Thundrik's Profiteers": return 15;
        case "Ylthari's Guardians": return 16;
        case "Ironsoul's Condemners": return 17;
        case "Lady Harrow's Mournflight": return 18;
        case "Grashrak's Despoilers": return 19;
        case "Skaeth's Wild Hunt": return 20;
        case "The Grymwatch": return 21;
        case "Rippa's Snarlfangs": return 22;
        case "Hrothgorn's Mantrappers": return 23;
        case "The Wurmspat": return 24;
        case "Morgwaeth's Blade Coven": return 25;
        case "Morgok's Krushas": return 26;
        
        case "Myari's Purifiers": return 27;
        case "The Dread Pageant": return 28;
        default: return -1;
    }
}

const factionIndexes = [
    "universal",
    "garreks-reavers",
    "steelhearts-champions",
    "sepulchral-guard",
    "ironskulls-boyz",
    "the-chosen-axes",
    "spiteclaws-swarm",
    "magores-fiends",
    "the-farstriders", // 8

    // NIGHTVAULT

    "stormsires-cursebreakers", // 9
    "thorns-of-the-briar-queen", // 10
    "the-eyes-of-the-nine", // 11
    "zarbags-gitz", // 12
    "godsworn-hunt", // 13
    "mollogs-mob", // 14
    "thundriks-profiteers", // 15
    "yltharis-guardians", // 16

    // DREADFANE

    "ironsouls-condemners", // 17
    "lady-harrows-mournflight", // 18

    // BEASTGRAVE

    "grashraks-despoilers", // 19
    "skaeths-wild-hunt", // 20
    "the-grymwatch", // 21
    "rippas-snarlfangs", // 22
    "hrothgorns-mantrappers", // 23
    "the-wurmspat", // 24
    "morgwaeths-blade-coven", // 25
    "morgoks-krushas", // 26

    "myaris-purifiers", // 27
    "dread-pageant", // 28
]

const factionIdPrefix = {
    "universal": "u",
    "garreks-reavers" : "gr",
    "steelhearts-champions" : "sc",
    "sepulchral-guard" : "sg",
    "ironskulls-boyz" : "ib",
    "the-chosen-axes" : "tca",
    "spiteclaws-swarm" : "ss",
    "magores-fiends" : "mf",
    "the-farstriders" : "tf",

    // NIGHTVAULT

    "stormsires-cursebreakers": "stc",
    "thorns-of-the-briar-queen": "toftbq",
    "the-eyes-of-the-nine": "teotn",
    "zarbags-gitz": "zg",
    "godsworn-hunt": "gh",
    "mollogs-mob": "mm",
    "thundriks-profiteers": "tp",
    "yltharis-guardians": "yg",

    // DREADFANE

    "ironsouls-condemners": "ic",
    "lady-harrows-mournflight": "lhm",

    // BEASTGRAVE

    "grashraks-despoilers": "gd",
    "skaeths-wild-hunt": "swh",
    "the-grymwatch": "tg",
    "rippas-snarlfangs" : 'rs',
    "hrothgorns-mantrappers": "hm",
    "the-wurmspat": "tw",
    "morgwaeths-blade-coven": "mbc",
    "morgoks-krushas": "mk",

    "myaris-purifiers": "mp",
    "dread-pageant": "dp",
}

const decodeUDB = card => {
    if(card.toUpperCase().startsWith('L')) return 2000 + Number(card.slice(1));
    if(card.toUpperCase().startsWith('N')) return 3000 + Number(card.slice(1));
    if(card.toUpperCase().startsWith('P')) return 4000 + Number(card.slice(1));
    if(card.toUpperCase().startsWith('DC')) return 9000 + Number(card.slice(2));
    if(card.toUpperCase().startsWith('D')) return 5000 + Number(card.slice(1));
    if(card.toUpperCase().startsWith('B')) return 6000 + Number(card.slice(1));
    if(card.toUpperCase().startsWith('G')) return 7000 + Number(card.slice(1));
    if(card.toUpperCase().startsWith('A')) return 8000 + Number(card.slice(1));
    return 1000 + Number(card);
}

function parse(text) {
    const wudb = {
        sets: {},
        factions: {},
        cards: {},
    }

    return toLines(text).slice(1).map(line => line.split('\t')).reduce(
        (acc, [release,,number,,,,,name,faction,type,glory,description,,otype,,set,status, OP,,F,R,FR,rotated, ...rest], i) => {
            console.log("Parsing line > ", i);
            if(name == '-') return acc;
            // populate sets table
            if(!acc.sets[set]) {
                const index = setsNames.indexOf(set);
                if(index < 0) throw Error(`Cannot find index for > ${set}`);

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
                    status: `${OP[0]}${F != '-' ? 'Y' : '-'}${R != '-' ? 'Y' : '-'}_${OP[1]}${FR != '-' ? 'Y' : '-'}_${OP[2]}`,
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

function findDuplicatesByName(name, source) {
    return Object.entries(source)
        .filter(([number, data]) => data.name == name);        
}

fs.writeFileSync(path.join(__dirname, 'wudb.js'), JSON.stringify(parse(tsvFile), null, 4));
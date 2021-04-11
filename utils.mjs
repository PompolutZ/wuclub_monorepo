export const getScoreType = text => {
    if(text.includes('Score this immediately'))
        return 0;

    if(text.includes('Score this in an end phase'))
        return 1;
        
    if(text.includes('Score this in the third end'))    
        return 2;
}

export const getType = text => {
    switch(text) {
        case "Objective": return 0;
        case "Ploy": return 1;
        case "Upgrade": return 2;
        case "Spell": return 3;
        default: return -1;
    }
}

export const getFaction = text => {
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
        case "Morgwaeth's Blade-coven": return 25;
        case "Morgok's Krushas": return 26;
        
        case "Myari's Purifiers": return 27;
        case "The Dread Pageant": return 28;
        case "Khagra's Ravagers": return 29;
        case "The Starblood Stalkers": return 30;
        case "The Crimson Court": return 31;
        case "orks": return 31;
        case "death": return 32;
        case "idoneth": return 33;
        case "Storm of Celestus": return 34;
        case "Drepur's Wraithcreepers": return 35;
        default: return -1;
    }
}

export const decodeUDB = card => {
    if(card.toUpperCase().startsWith('L')) return 2000 + Number(card.slice(1));
    if(card.toUpperCase().startsWith('N')) return 3000 + Number(card.slice(1));
    if(card.toUpperCase().startsWith('P')) return 4000 + Number(card.slice(1));
    if(card.toUpperCase().startsWith('DC')) return 9000 + Number(card.slice(2));
    if(card.toUpperCase().startsWith('D')) return 5000 + Number(card.slice(1));
    if(card.toUpperCase().startsWith('B')) return 6000 + Number(card.slice(1));
    if(card.toUpperCase().startsWith('G')) return 7000 + Number(card.slice(1));
    if(card.toUpperCase().startsWith('A')) return 8000 + Number(card.slice(1));
    if(card.toUpperCase().startsWith('S')) return 10000 + Number(card.slice(1));
    if(card.toUpperCase().startsWith('E')) return 11000 + Number(card.slice(1));
    return 1000 + Number(card);
}

export function findDuplicatesByName(name, source) {
    return Object.entries(source)
        .filter(([number, data]) => data.name == name);        
}


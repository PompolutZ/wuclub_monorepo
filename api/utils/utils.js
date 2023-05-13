export function sanitizeString(str) {
    if (typeof str !== 'string') return null;

    return str.split('').reduce((acc, char) => {
        return [...acc, char === '-' || char === ' ' ? char : char.replace(/\{|\}|\$|\:|\n/, '')]
    }, []).join('');
}

export function sanitizeNumbersArray(arr) {
    return sanitizeArray(arr, x => Number(x));
}

function sanitizeArray(arr, f) {
    if (!Array.isArray(arr)) return null;

    return arr.map(x => f(x));
}
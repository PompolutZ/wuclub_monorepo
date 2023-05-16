export function validateDeckId(value) {
    const match = validate(value, /^[a-z]{2,6}-[a-z0-9]{12}$/);
    if (match) {
        return match[0];
    }

    return null;
}

function validate(value, regex) {
    return value.match(regex);
}
import { sanitizeNumbersArray, sanitizeString } from "./utils.js"

describe('should sanitize string', () => {
    test('given non-string return null', () => {
        expect(sanitizeString(1)).toBeNull();
    })

    test('given normal string returns it unchanged', () => {
        expect(sanitizeString("test-123")).toBe("test-123")
    })

    test('given string with white spaces keeps them', () => {
        expect(sanitizeString("test 123")).toBe("test 123")
    })

    test('given with possible injection symbols removes them', () => {
        expect(sanitizeString("test-123 { $1: }!")).toBe("test-123  1 !")
    })

    test('with new line characters', () => {
        expect(sanitizeString("test\n\n\n123")).toBe("test123")
    })
})

describe('should sanitize array', () => {
    test('given non-array return null', () => {
        expect(sanitizeNumbersArray('[]')).toBeNull();
    })

    test('given array of numbers returns it unchanged', () => {
        expect(sanitizeNumbersArray([1,2,3,4])).toEqual([1,2,3,4])
    })

    test('given array of numbers and injections returns NaN for injections', () => {
        expect(sanitizeNumbersArray([1,'$gt'])).toEqual([1,NaN])
    })

    test('given array of numbers and injections returns NaN for injections', () => {
        expect(sanitizeNumbersArray(['1', 2])).toEqual([1,2])
    })
})
export const log = console.log

export function gen (size) {
    return Array.apply(null, {length: size}).map(Number.call, Number)
}
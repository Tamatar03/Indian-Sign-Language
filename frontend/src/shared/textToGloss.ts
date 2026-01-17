/**
 * Simple rule-based engine to convert English text to ISL Gloss.
 * Rules:
 * 1. Convert to Uppercase
 * 2. Remove Punctuation
 * 3. Remove Stop Words (Articles, 'to be' verbs, prepositions)
 * 4. Return array of tokens
 */

const STOP_WORDS = new Set([
    'A', 'AN', 'THE',
    'IS', 'AM', 'ARE', 'WAS', 'WERE', 'BE', 'BEING', 'BEEN',
    'TO', 'OF', 'IN', 'FOR', 'BY', 'ON', 'AT', 'WITH', 'FROM'
]);

export function convertToGloss(text: string): string[] {
    if (!text) return [];

    return text
        .toUpperCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .split(/\s+/)            // Split by whitespace
        .filter(word => word && !STOP_WORDS.has(word)); // Remove empty strings and stop words
}

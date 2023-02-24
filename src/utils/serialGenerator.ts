
let currentIndex = 0x0;

/**
 * Get next string sequential id
 *
 * @returns
 */
export function nextString() {
    return (currentIndex++).toString(16);
}

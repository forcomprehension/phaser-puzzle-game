
let currentIndex = 0x0;

/**
 * Get next string sequential id
 *
 * @returns
 */
export function nextString() {
    return (currentIndex++).toString(16);
}

/**
 * Get next int sequential id
 *
 * @returns
 */
export function nextInt() {
    return ++currentIndex;
}

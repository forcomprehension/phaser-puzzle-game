
/**
 * Fill array to given index with fill value.
 * This function helps to avoid sparse arrays, when index is assigned
 *
 * @param array 
 * @param end 
 * @param fillValue 
 */
export function completeTo<V>(array: V[], index: number, fillValue: V) {
    for (let i = 0; i < index; i++) {
        if (typeof array[index] === "undefined") {
            array[index] = fillValue;
        }
    }
}

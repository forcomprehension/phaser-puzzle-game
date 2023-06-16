import { MAX_SAFE_INTEGER, MIN_SAFE_INTEGER } from "@src/constants/number";

/**
 * Validate number
 *
 * @param value
 */
export function checkNumberIsSuitable(value: number) {
    return !Number.isNaN(value) && value >= MIN_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
}

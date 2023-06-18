import { MAX_SAFE_INTEGER, MIN_SAFE_INTEGER } from "@src/constants/number";

const REGEXP_BAN_NON_DECIMAL_NUMERIC = /[^0-9]+/;

/**
 * Validate number
 *
 * @param value
 */
export function checkNumberIsSuitable(value: number) {
    return !Number.isNaN(value) && value >= MIN_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
}

/**
 * Check that value is strictly numeric, i.e. without A-Z, exp, and so on
 */
export function isDecimal(str: string) {
    if (str[0] === '0' && str.length > 1) {
        return false;
    }

    return str && !REGEXP_BAN_NON_DECIMAL_NUMERIC.test(
        str[0] === '-' ? str.slice(1) : str
    );
}

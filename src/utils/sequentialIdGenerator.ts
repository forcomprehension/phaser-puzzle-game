
/**
 * Code for symbol - "A"
 */
const FIRST_ASCII_SYMBOL_CODE = 65;

/**
 * English alphabet last symbol - "Z"
 */
const ALPHABET_LENGTH = 26;

/**
 * Generates sequential id based on some alphabet.
 * By default it's uses an english alphabet.
 */
export class SequentialIdGenerator {
    protected index: number = 0;

    constructor(
        public readonly firstSymbolCode: number = FIRST_ASCII_SYMBOL_CODE,
        public readonly alphabetLength: number = ALPHABET_LENGTH
    ) {}

    public next() {
        const number = this.index % this.alphabetLength;
        const order = Math.floor(this.index / this.alphabetLength);

        let out = String.fromCharCode(this.firstSymbolCode + number);
        if (order) {
            out = out + String.fromCharCode(this.firstSymbolCode + this.alphabetLength - 1).repeat(order);
        }

        this.index++;

        return out;
    }
}


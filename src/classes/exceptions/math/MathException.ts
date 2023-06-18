
export enum MathErrorCodes {
    DIVISION_BY_ZERO = 'DIVISION_BY_ZERO',
    INT_OVERFLOW = 'INT_OVERFLOW',
    OTHER = 'OTHER',
}


/**
 * Common math exception
 */
export class MathException extends Error {
    constructor(code: MathErrorCodes) {
        super(code);
    }
}

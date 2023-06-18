
export enum InvalidRPNErrorCodes {
    INVALID_ARGS_LENGTH = 'INVALID_ARGS_LENGTH',
    INVALID_ADDITION = 'INVALID_ADDITION',
    INVALID_DIVISION = 'INVALID_DIVISION',
    INVALID_SUBTRACTION = 'INVALID_SUBTRACTION',
    INVALID_MULTIPLICATION = 'INVALID_MULTIPLICATION'
}

/**
 * Exception for evaluating reverse polish notation
 */
export class InvalidRPNException extends Error {
    /**
     * Ctor
     */
    constructor(code: InvalidRPNErrorCodes) {
        super(code);
    }
}

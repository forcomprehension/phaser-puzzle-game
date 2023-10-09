import { InvalidRPNErrorCodes, InvalidRPNException } from "@src/classes/exceptions/math/InvalidRPNException";
import { MathErrorCodes, MathException } from "@src/classes/exceptions/math/MathException";
import { checkNumberIsSuitable, isDecimal } from "@utils/number";

/**
 * Evaluate expression in reverse polish notation
 */
export function evaluateRPN(rpn: string): number {
    const tokens = rpn.split(' ');

    if (tokens.length < 3) {
        throw new InvalidRPNException(InvalidRPNErrorCodes.INVALID_ARGS_LENGTH);
    }

    const stack: number[] = [];
    let isInitialized: boolean = false;
    let result: number = 0;

    for (let i = 0; i < tokens.length; i++) {
        switch (tokens[i]) {
            case "+": {
                const addend = stack.pop();
                if (addend === undefined) {
                    throw new InvalidRPNException(InvalidRPNErrorCodes.INVALID_ADDITION);
                }

                // @TODO: check overflow?
                result += addend;
                break;
            }

            case "-": {
                const subtrahend = stack.pop();
                if (subtrahend === undefined) {
                    throw new InvalidRPNException(InvalidRPNErrorCodes.INVALID_SUBTRACTION);
                }

                result -= subtrahend;
                break;
            }

            case "*": {
                const multiplier = stack.pop();
                if (multiplier === undefined) {
                    throw new InvalidRPNException(InvalidRPNErrorCodes.INVALID_MULTIPLICATION);
                }

                // @TODO: check overflow?

                result *= multiplier;
                break;
            }

            case "/": {
                const divider = stack.pop();

                if (divider === undefined) {
                    throw new InvalidRPNException(InvalidRPNErrorCodes.INVALID_DIVISION);
                }

                if (divider === 0) {
                    throw new MathException(MathErrorCodes.DIVISION_BY_ZERO);
                }

                result /= divider;
                break;
            }

            case "%": {
                const modulo = stack.pop();

                if (!modulo) {
                    throw new InvalidRPNException(InvalidRPNErrorCodes.INVALID_DIVISION_REMAINDER);
                }

                if (modulo === 0) {
                    throw new MathException(MathErrorCodes.MODULO_FROM_ZERO);
                }

                result %= modulo;
                break;
            }

            default: {
                const number = Number(tokens[i]);
                if (!isDecimal(tokens[i]) || !checkNumberIsSuitable(number)) {
                    throw new MathException(MathErrorCodes.OTHER);
                }

                if (!isInitialized) {
                    result = number;
                    isInitialized = true;
                } else {
                    stack.push(number);
                }

                break;
            }
        }
    }

    if (result === null) { // @TODO: need an exception?
        result = 0;
    }

    return result;
}

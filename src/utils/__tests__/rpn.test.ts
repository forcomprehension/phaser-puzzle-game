import { describe, test, expect } from '@jest/globals';
import { MathErrorCodes, MathException } from '@src/classes/exceptions/math/MathException';
import { evaluateRPN } from '@utils/rpn';

describe('Tests for reverse polish notation evaluation', () => {
    test('Calculate celsius from fahrenheit', () => {
        const rpn = '212 32 - 9 / 5 *';
        const expected = 100;
        const actual = evaluateRPN(rpn);

        expect(actual).toBe(expected);
    });

    test('Division by zero must throw math exception', () => {
        const rpn = '212 0 /';
        const checker = () => {
            evaluateRPN(rpn)
        };

        expect(checker).toThrow(MathException);
        expect(checker).toThrow(MathErrorCodes.DIVISION_BY_ZERO);
    });

    test('Positive overflow must throw exception', () => {
        const rpn = `${Number.MAX_SAFE_INTEGER} 34 -`;
        const checker = () => {
            evaluateRPN(rpn)
        };

        expect(checker).toThrow(MathException);
        expect(checker).toThrow(MathErrorCodes.OTHER);
    });

    test('Negative overflow must throw exception', () => {
        const rpn = `${Number.MIN_SAFE_INTEGER} 34 +`;
        const checker = () => {
            evaluateRPN(rpn)
        };

        expect(checker).toThrow(MathException);
        expect(checker).toThrow(MathErrorCodes.OTHER);
    });

    test('Not a number must throw exception', () => {
        const rpn = `ss 34 +`;
        const checker = () => {
            evaluateRPN(rpn)
        };

        expect(checker).toThrow(MathException);
        expect(checker).toThrow(MathErrorCodes.OTHER);
    });

    test.each([
        ['10 4 %', 2],
        ['100 17 % 6 * 3 / 5 + 1 -', 34]
    ])('Complex expression with modulo "%s" must be equal to %d', (rpn, expectedValue) => {
        expect(evaluateRPN(rpn)).toEqual(expectedValue);
    });
});

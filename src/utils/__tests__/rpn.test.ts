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
});

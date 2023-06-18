import { describe, test, expect } from '@jest/globals';
import { isDecimal } from '@utils/number';

describe('Tests for number utils', () => {
    test.each([
        ['10e3', false],
        ['067', false],
        ['-100', true],
        ['ss', false],
        ['NaN', false],
        ['undefined', false],
        ['0', true],
        ['342332', true],
        ['-0x23', false],
        ['0xAB', false],
    ])('::isDecimal(%s) must return Boolean(%d)', (payload, expectedResult) => {
        const actual = isDecimal(payload);
        expect(actual).toBe(expectedResult);
    });
});
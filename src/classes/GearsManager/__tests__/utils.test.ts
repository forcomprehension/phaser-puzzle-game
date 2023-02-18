import { describe, test, expect } from '@jest/globals';
import { ROTATION_DIRECTION } from '../../../utils/types';
import { checkGearsRotationsAreCompatible } from '../utils';

describe('Testing GearGraph utils', () => {
    test.each([
        [{ direction: ROTATION_DIRECTION.CW }, { direction: ROTATION_DIRECTION.CCW }, true],
        [{ direction: ROTATION_DIRECTION.CCW }, { direction: ROTATION_DIRECTION.CW }, true],
        [{ direction: ROTATION_DIRECTION.CW }, { direction: ROTATION_DIRECTION.IDLE }, true],
        [{ direction: ROTATION_DIRECTION.CCW }, { direction: ROTATION_DIRECTION.IDLE }, true],

        [{ direction: ROTATION_DIRECTION.IDLE }, { direction: ROTATION_DIRECTION.IDLE }, false],
        [{ direction: ROTATION_DIRECTION.CCW }, { direction: ROTATION_DIRECTION.CCW }, false],
        [{ direction: ROTATION_DIRECTION.CW }, { direction: ROTATION_DIRECTION.CW }, false],
    ])('checkGearsRotationsAreCompatible case: %#', (lhs, rhs, expected) => {
        const actual = checkGearsRotationsAreCompatible(rhs, lhs);
        expect(actual).toBe(expected);
    });
});

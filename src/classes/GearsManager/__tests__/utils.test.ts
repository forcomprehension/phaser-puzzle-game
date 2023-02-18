import { describe, test, expect } from '@jest/globals';
import { GEAR_ROTATION_DIRECTION } from '../GearGraph';
import { checkGearsRotationsAreCompatible } from '../utils';

describe('Testing GearGraph utils', () => {
    test.each([
        [{ direction: GEAR_ROTATION_DIRECTION.CW }, { direction: GEAR_ROTATION_DIRECTION.CCW }, true],
        [{ direction: GEAR_ROTATION_DIRECTION.CCW }, { direction: GEAR_ROTATION_DIRECTION.CW }, true],
        [{ direction: GEAR_ROTATION_DIRECTION.CW }, { direction: GEAR_ROTATION_DIRECTION.IDLE }, true],
        [{ direction: GEAR_ROTATION_DIRECTION.CCW }, { direction: GEAR_ROTATION_DIRECTION.IDLE }, true],

        [{ direction: GEAR_ROTATION_DIRECTION.IDLE }, { direction: GEAR_ROTATION_DIRECTION.IDLE }, false],
        [{ direction: GEAR_ROTATION_DIRECTION.CCW }, { direction: GEAR_ROTATION_DIRECTION.CCW }, false],
        [{ direction: GEAR_ROTATION_DIRECTION.CW }, { direction: GEAR_ROTATION_DIRECTION.CW }, false],
    ])('checkGearsRotationsAreCompatible case: %#', (lhs, rhs, expected) => {
        const actual = checkGearsRotationsAreCompatible(rhs, lhs);
        expect(actual).toBe(expected);
    });
});

import { GearNode, GEAR_ROTATION_DIRECTION } from "./GearGraph";

export type DirectionFromGearNode = Pick<GearNode, 'direction'>

/**
 * Gear rotations must be opposite states or in idle state. Idle state not blocking, for now
 */
export function checkGearsRotationsAreCompatible(
    vData: DirectionFromGearNode,
    wData: DirectionFromGearNode
) {
    return vData.direction != wData.direction;
}

/**
 * Returns direction opposite by vData gear
 *
 * @param vData
 */
export function getOppositeDirection(vData: DirectionFromGearNode) {
    switch (vData.direction) {
        case GEAR_ROTATION_DIRECTION.CCW: {
            return GEAR_ROTATION_DIRECTION.CW;
        }

        case GEAR_ROTATION_DIRECTION.CW: {
            return GEAR_ROTATION_DIRECTION.CCW;
        }

        default: {
            return GEAR_ROTATION_DIRECTION.IDLE;
        }
    }
}

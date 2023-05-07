import { ROTATION_DIRECTION } from "@utils/types";
import type { GearNode } from "./GearGraph";


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
        case ROTATION_DIRECTION.CCW: {
            return ROTATION_DIRECTION.CW;
        }

        case ROTATION_DIRECTION.CW: {
            return ROTATION_DIRECTION.CCW;
        }

        default: {
            return ROTATION_DIRECTION.IDLE;
        }
    }
}

/**
 * Check that rotation direction will rotate defined and non-idle {@see ROTATION_DIRECTION.IDLE}
 */
export function checkRotationDirectionIsRotated(direction: ROTATION_DIRECTION): direction is PickEnum<ROTATION_DIRECTION, ROTATION_DIRECTION.CCW | ROTATION_DIRECTION.CW> {
    return direction && direction !== ROTATION_DIRECTION.IDLE;
}

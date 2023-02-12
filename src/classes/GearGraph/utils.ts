import type { GearNode } from "./GearGraph";

export type DirectionFromGearNode = Pick<GearNode, 'direction'>

/**
 * Motor rotations must be opposite states or in idle state. Idle state not blocking, for now
 */
export function checkMotorsRotationsAreCompatible(
    vData: DirectionFromGearNode,
    wData: DirectionFromGearNode
) {
    return vData.direction != wData.direction;
}

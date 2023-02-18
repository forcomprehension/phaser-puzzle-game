/**
 * Gear rotation type
 */
export enum GEAR_ROTATION_DIRECTION {
    IDLE = "IDLE",
    CW = "CW",
    CCW = "CCW"
}

/**
 * Gear info
 */
export interface GearNode {
    isJammed: boolean,
    isMotor: boolean,
    direction: GEAR_ROTATION_DIRECTION
};

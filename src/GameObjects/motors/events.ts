import { ROTATION_DIRECTION } from "@utils/types";

export type MotorPulleyRotationHandler = (deltaRotation: number, rotationDirection: ROTATION_DIRECTION) => void;

export const MOTOR_PULLEY_EVENT_ROTATE = 'motor_pulley.rotate';

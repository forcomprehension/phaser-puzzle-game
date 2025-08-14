import { MotorPulley } from "@GameObjects/motors/MotorPulley";
import type { IConnectionSocket } from "@interfaces/IConnectionSocket";
import { BodyLabel } from "@src/constants/collision";
import { unsafeCastBody } from "./matter";

/**
 * Get socket connection from body
 *
 * @param body
 */
export function getGameObjectForConnectorsByBody(body: Phaser.Types.Physics.Matter.MatterBody) {
    let connector: Optional<IConnectionSocket>;
    const castedBody = unsafeCastBody(body);

    if (castedBody.label === BodyLabel.MOTOR) {
        connector = castedBody.gameObject as unknown as IConnectionSocket;
    } else if (castedBody.label === BodyLabel.MOTOR_PULLEY) {
        connector = (castedBody.gameObject  as unknown as MotorPulley).getMotor();
    } else if (castedBody.label === BodyLabel.GEAR) {
        connector = (castedBody.gameObject as unknown as IConnectionSocket);
    } else if (castedBody.label === BodyLabel.NODE_PIN) {
        connector = (castedBody.gameObject as unknown as IConnectionSocket);
    }

    return connector;
}


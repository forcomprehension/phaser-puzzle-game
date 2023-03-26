import { BodyLabel } from "@src/constants/collision";
import { Motor } from "./Motor";

/**
 * Pulley for motor
 */
export class MotorPulley extends Phaser.Physics.Matter.Image {
    /**
     * Ctor
     */
    constructor(
        world: Phaser.Physics.Matter.World,
        x: number,
        y: number,
        frame: Phaser.Textures.Frame,
        protected readonly motor: Motor
    ) {
        super(world, x, y, frame.texture.key, frame.name, {
            ignoreGravity: true,
            isSensor: true,
            label: BodyLabel.MOTOR_PULLEY,
            circleRadius: frame.radius * .75 // @TODO:
        });

        world.scene.add.existing(this);
    }

    /**
     * Gets a motor owner
     */
    public getMotor() {
        return this.motor;
    }
}

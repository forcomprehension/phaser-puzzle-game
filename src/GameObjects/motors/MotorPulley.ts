import { IConnectedObject } from "@interfaces/IConnectedObject";
import { BodyLabel } from "@src/constants/collision";
import { ROTATION_DIRECTION } from "@utils/types";
import { MOTOR_PULLEY_EVENT_ROTATE } from "./events";
import { Motor } from "./Motor";

/**
 * Pulley for motor
 */
export class MotorPulley extends Phaser.Physics.Matter.Image implements IConnectedObject {

    /**
     * Rotation value. We cannot set rotation here directly.
     * Because we have a rotation direction
     */
    public rotationValue: number = 0;

    /**
     * Current rotation direction
     */
    protected rotationDirection: ROTATION_DIRECTION = ROTATION_DIRECTION.IDLE;

    /**
     * Rotation tween
     */
    protected rotationTween: Phaser.Tweens.Tween;

    /**
     * Connected object
     */
    protected connectedObject: Nullable<IConnectedObject> = null;

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

        // @TODO: scene?
        this.rotationTween = world.scene.tweens.add({
            targets: this,
            paused: this.rotationDirection === ROTATION_DIRECTION.IDLE,
            duration: 1000,
            loop: -1,
            rotationValue: Phaser.Math.DegToRad(360),
            onUpdate: () => {
                const previous = this.rotationTween.data[0]?.previous || 0;
                this.rotateWheel(this.rotationValue - previous);
            }
        });

        // @TODO: KOSTYL

        setTimeout(() => {
            this.updateRotationDirection(ROTATION_DIRECTION.CCW);
        }, 1000);
    }


    public getBodyLabel(): BodyLabel {
        return BodyLabel.MOTOR_PULLEY;
    }

    public getSocketLocation(): Readonly<Vector2Like> {
        return this.getMotor().getSocketLocation();
    }

    /**
     * Gets a motor owner
     */
    public getMotor() {
        return this.motor;
    }

    public getConnectedObject() {
        return this.connectedObject;
    }

    public connectObject(newConnection: IConnectedObject) {
        this.connectedObject = newConnection;
    }

    public disconnectObject() {
        this.connectedObject = null;
    }

    /**
     * Sets new rotation direction
     *
     * @param newDirection
     */
    public updateRotationDirection(newDirection: ROTATION_DIRECTION) {
        const oldDirection = this.rotationDirection;
        this.rotationDirection = newDirection;

        if (oldDirection === ROTATION_DIRECTION.IDLE && newDirection !== ROTATION_DIRECTION.IDLE)  {
            this.rotationTween.resume();
        } else if (oldDirection !== ROTATION_DIRECTION.IDLE && newDirection === ROTATION_DIRECTION.IDLE) {
            this.rotationTween.pause();
        }
    }

    /**
     * "Update" method
     */
    protected rotateWheel(delta: number) {
        this.emit(MOTOR_PULLEY_EVENT_ROTATE, delta, this.rotationDirection);

        if (this.rotationDirection === ROTATION_DIRECTION.CW) {
            this.setRotation(this.rotationValue);
        } else if (this.rotationDirection === ROTATION_DIRECTION.CCW) {
            this.setRotation(Phaser.Math.DEG_TO_RAD - this.rotationValue);
        }
    }
}

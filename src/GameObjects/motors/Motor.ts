import { IConnectionSocket } from "@interfaces/IConnectionSocket";
import { IConnectorObject } from "@interfaces/IConnectorObject";
import { BodyLabel } from "@src/constants/collision";
import { ROTATION_DIRECTION } from "@utils/types";
import type { ConstraintType } from "matter";
import { getMatterBody } from "../../physics/matter";
import { MotorPulley } from "./MotorPulley";

/**
 * Creates a motor game object
 */
export class Motor extends Phaser.Physics.Matter.Image implements IConnectionSocket, IConnectorObject {
    /**
     * Pulley offset
     */
    protected static readonly PULLEY_OFFSET: Readonly<Vector2Like> = Object.freeze({
        x: -50,
        y: -20,
    });

    /**
     * Pulley subobject
     */
    protected readonly pulley: Phaser.Physics.Matter.Image;

    /**
     * Pin joint for pulley
     */
    protected readonly pinJoint: ConstraintType;

    /**
     * Current rotation direction
     */
    protected rotationDirection: ROTATION_DIRECTION = ROTATION_DIRECTION.IDLE;

    /**
     * If something already connected
     */
    protected pulleyConnection: boolean = false;

    /**
     * Ctor
     */
    constructor(scene: Phaser.Scene, x: number, y: number) {
        const texture = scene.textures.get('motor');
        const frameNames = texture.getFrameNames();
        const pulleyFrame = scene.textures.getFrame(texture.key, frameNames[1]);

        super(scene.matter.world, x, y, texture, frameNames[0], {
            ignoreGravity: true,
            isSensor: true,
            label: BodyLabel.MOTOR
        });

        scene.add.existing(this);

        this.pulley = new MotorPulley(
            this.scene.matter.world,
            x + Motor.PULLEY_OFFSET.x,
            y + Motor.PULLEY_OFFSET.y,
            pulleyFrame,
            this
        );

        this.pinJoint = scene.matter.add.constraint(getMatterBody(this), getMatterBody(this.pulley), 0, 1, {
            pointA: Motor.PULLEY_OFFSET,
            angularStiffness: 1
        });

        // @TODO: move
        scene.add.tween({
            targets: this.pulley,
            rotation: Phaser.Math.DegToRad(360),
            duration: 1000,
            loop: -1,
        });
    }

    public getBodyLabel(): BodyLabel {
        return BodyLabel.MOTOR;
    }

    public connectConnector(): void {
        this.pulleyConnection = true;
    }

    public disconnectConnector(): void {
        this.pulleyConnection = false;
    }

    public getConnectorObject(): IConnectorObject {
        return this;
    }

    public getSocketPosition(): Readonly<Vector2Like> {
        return this.getSocketLocation();
    }

    /**
     * @inheritdoc
     */
    public getSocketLocation(): Vector2Like {
        const { x, y } = this.body.position;

        return {
            x: x + Motor.PULLEY_OFFSET.x,
            y: y + Motor.PULLEY_OFFSET.y
        };
    }

    /**
     * @inheritdoc
     */
    public getSocketIsBusy(): boolean {
        return this.pulleyConnection;
    }

    /**
     * Sets new rotation direction
     *
     * @param newDirection
     */
    public updateRotationDirection(newDirection: ROTATION_DIRECTION) {
        this.rotationDirection = newDirection;
    }
}

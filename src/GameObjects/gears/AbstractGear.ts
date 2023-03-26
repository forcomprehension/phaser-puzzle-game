import { IConnectionSocket } from '@interfaces/IConnectionSocket';
import { IConnectorObject } from '@interfaces/IConnectorObject';
import { BodyLabel } from '@src/constants/collision';
import { ROTATION_DIRECTION } from '@utils/types';
import { nextString } from '../../utils/serialGenerator'

/**
 * Abstract class for gears representation
 */
export abstract class AbstractGear extends Phaser.Physics.Matter.Image implements IConnectionSocket, IConnectorObject {

    /**
     * Serial ID.
     */
    public readonly serialID: string;

    /**
     * Rotation ratio, based on gear teeth count.
     *
     * Must be more than 1
     */
    public readonly rotationRatio: number = 1;

    /**
     * Rotation direction
     */
    protected rotationDirection: ROTATION_DIRECTION = ROTATION_DIRECTION.IDLE;

    /**
     * Does socket is busy?
     */
    protected rotationSocketIsBusy: boolean = false;

    /**
     * @TODO: remove then we not rely on display size
     */
    protected static get defaultPhysicsConfig() {
        return {
            isSensor: true,
            isStatic: true,
            ignoreGravity: true,
            label: BodyLabel.GEAR
        } as Phaser.Types.Physics.Matter.MatterBodyConfig;
    }

    /**
     * @inheritdoc
     */
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture) {
        super(scene.matter.world, x, y, texture, undefined, AbstractGear.defaultPhysicsConfig);

        this.serialID = nextString();

        scene.add.existing(this);
    }

    public getBodyLabel(): BodyLabel {
        return BodyLabel.GEAR;
    }

    public connectConnector(): void {
        this.rotationSocketIsBusy = true;
    }

    public disconnectConnector(): void {
        this.rotationSocketIsBusy = false;
    }

    public getConnectorObject(): IConnectorObject {
        return this;
    }

    public getSocketPosition(): Readonly<Vector2Like> {
        return this.body.position;
    }

    /**
     * @inheritdoc
     */
    public getSocketLocation(): Vector2Like {
        return {
            x: this.body.position.x,
            y: this.body.position.y
        };
    }

    /**
     * @inheritdoc
     */
    public getSocketIsBusy(): boolean {
        return this.rotationSocketIsBusy;
    }

    protected setPhysicsBoundsByCoefficient(coefficient: number) {
        this.setCircle(coefficient, AbstractGear.defaultPhysicsConfig);
    }

    public setRotationDirection(rotation: ROTATION_DIRECTION) {
        this.rotationDirection = rotation;
    }

    public getRotationDirection() {
        return this.rotationDirection;
    }
}

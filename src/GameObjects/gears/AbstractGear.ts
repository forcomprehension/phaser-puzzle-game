import { IConnectionSocket } from '@interfaces/IConnectionSocket';
import { IConnectedObject } from '@interfaces/IConnectedObject';
import { BodyLabel } from '@src/constants/collision';
import { ROTATION_DIRECTION } from '@utils/types';
import { nextString } from '../../utils/serialGenerator'
import { GearsManager } from './GearsManager';

/**
 * Abstract class for gears representation
 */
export abstract class AbstractGear extends Phaser.Physics.Matter.Image implements IConnectionSocket, IConnectedObject {

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
    protected connectedObject: Nullable<IConnectedObject> = null;

    /**
     * Manager, which owns this gear
     */
    protected manager: Optional<GearsManager>;

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

    /**
     * Registration/unregistration of manager
     *
     * @param manager
     */
    public registration(manager: Optional<GearsManager>) {
        this.manager = manager;
    }

    /**
     * Connect other object to this object's socket
     *
     * @param target
     */
    public connectObject(target: IConnectedObject): void {
        this.connectedObject = target;

        if (target instanceof AbstractGear) {
            this.manager?.connectGears(this, target, true);
        }
    }

    /**
     * Disconnect object from socket
     *
     * @param target
     */
    public disconnectObject(target: IConnectedObject) {
        if (this.connectedObject === target) { // @TODO: needed?
            if (this.connectedObject instanceof AbstractGear) {
                this.manager?.disconnectGears(this, this.connectedObject);
            }

            this.connectedObject = null;
        }
    }

    public getConnectorObject(): IConnectedObject {
        return this;
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
        return !!this.connectedObject;
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

    /**
     * Change rotation through manager
     *
     * @param rotation
     */
    public askManagerToChangeRotation(rotation: Optional<ROTATION_DIRECTION>) {
        this.manager?.toggleMotor(this, rotation);
    }
}

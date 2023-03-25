import { ROTATION_DIRECTION } from '@utils/types';
import { nextString } from '../../utils/serialGenerator'

export abstract class AbstractGear extends Phaser.Physics.Matter.Image {

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
     * @TODO: remove then we not rely on display size
     */
    protected static get defaultPhysicsConfig() {
        return {
            isSensor: true,
            isStatic: true,
            ignoreGravity: true
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

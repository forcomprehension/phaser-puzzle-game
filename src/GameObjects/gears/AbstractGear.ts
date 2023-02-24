import { ROTATION_DIRECTION } from '@utils/types';
import { nextString } from '../../utils/serialGenerator'

export abstract class AbstractGear extends Phaser.Physics.Matter.Image {

    /**
     * Serial ID.
     */
    public readonly serialID: string;

    /**
     * Rotation direction
     */
    protected rotationDirection: ROTATION_DIRECTION = ROTATION_DIRECTION.IDLE;

    /**
     * @inheritdoc
     */
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture) {
        super(scene.matter.world, x, y, texture);

        this.serialID = nextString();

        scene.add.existing(this);
    }

    protected setPhysicsBoundsByCoefficient(coefficient: number) {
        this.setCircle(coefficient);
        this.setIgnoreGravity(true);
    }

    public setRotationDirection(rotation: ROTATION_DIRECTION) {
        this.rotationDirection = rotation;
    }

    public getRotationDirection() {
        return this.rotationDirection;
    }
}

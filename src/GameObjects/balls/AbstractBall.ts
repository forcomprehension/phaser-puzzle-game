import { WORLD_STATIC } from "@src/constants/collision";
import { BaseGameScene } from "@src/scenes/BaseGameScene";

/**
 * All balls shape
 */
export abstract class AbstractBall extends Phaser.Physics.Matter.Image {
    /**
     * Ctor
     */
    constructor(
        public scene: BaseGameScene,
        x: number,
        y: number,
        texture: string,
        bounce: number = 1
    ) {
        const textureObject = scene.textures.get(texture);
        const imageHeight = textureObject.getSourceImage().height;

        super(scene.matter.world, x, y, texture, undefined, {
            collisionFilter: {
                category: WORLD_STATIC,
            },
            circleRadius: imageHeight / 2
        });

        this.setBounce(bounce);

        scene.add.existing(this);
    }
}

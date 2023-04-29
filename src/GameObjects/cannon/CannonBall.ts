import { getMatterBody } from "@src/physics/matter";
import { BaseGameScene } from "@src/scenes/BaseGameScene";

/**
 * Cannon ball. Shoot by {@see Cannon}
 */
export class CannonBall extends Phaser.Physics.Matter.Image {
    /**
     * Gravity Y multiplier
     */
    public static readonly GRAVITY_SCALE_VERTICAL = .075;

    /**
     * Force multiplier
     */
    public static readonly FORCE_VALUE = .2;

    /**
     * Ctor
     *
     * @param scene
     * @param x
     * @param y
     */
    constructor(scene: BaseGameScene, x: number, y: number) {
        super(scene.matter.world, x, y, 'cannon', 'cannonball.png', {
            gravityScale: {
                y: CannonBall.GRAVITY_SCALE_VERTICAL,
                x: 1
            },
            circleRadius: 16 + 2 // @TODO: determine from sys
        });
        scene.add.existing(this);

        const textureOffset = this.frame.width / 2;

        scene.matter.body.applyForce(
            getMatterBody(this),
            {
                x: this.x + textureOffset,
                y: this.y
            },
            { x: CannonBall.FORCE_VALUE, y: 0 }
        );
    }
}

import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { CannonBall } from "./CannonBall";

/**
 * Cannon game object. Shoots {@see CannonBall}
 */
export class Cannon extends Phaser.Physics.Matter.Image {

    public static readonly MUZZLE_OFFSET = { // @TODO:
        x: 126,
        y: 0
    };

    protected readonly tween: Phaser.Tweens.Tween;

    /**
     * Ctor
     *
     * @param scene
     * @param x
     * @param y
     */
    constructor(public scene: BaseGameScene, x: number, y: number) {
        const shape = scene.cache.json.get('cannon-body');

        super(scene.matter.world, x, y, 'cannon', 'cannon.png', {
            ignoreGravity: true,
            // @ts-ignore
            shape: shape.cannon
        });

        this.setOrigin(.5);

        scene.add.existing(this);

        this.tween = this.scene.tweens.create({
            targets: this,
            x: '-=15',
            angle: '-=4',
            duration: 100,
            ease: Phaser.Math.Easing.Quintic.Out,
            yoyo: true,
        });
    }

    public shoot() {
        this.tween.play();

        new CannonBall(
            this.scene,
            this.x + Cannon.MUZZLE_OFFSET.x,
            this.y + Cannon.MUZZLE_OFFSET.y,
        );
    }
}


import type { BaseGameScene } from "@src/scenes/BaseGameScene";

/**
 * Character Tom class
 */
export class Tom extends Phaser.GameObjects.Sprite {

    /**
     * Blink eye anims
     */
    public static readonly BLINK_ANIM_FRAMES_COUNT = 6;

    /**
     * Count of end walk frames
     */
    public static readonly END_WALK_FRAMES_COUNT = 7;

    /**
     * Interval between eyeticks
     */
    public static readonly EYETICK_DELAY = 10000;

    /**
     * Ctor
     */
    constructor(scene: BaseGameScene, x: number, y: number) {
        super(scene, x, y, 'tom');

        this.setScale(1.5);
        this.createAnims();

        const event = this.scene.time.addEvent({
            delay: Tom.EYETICK_DELAY,
            callback(this: Tom) {
                if (!this.anims.isPlaying) {
                    this.play('tom-blink');
                }
            },
            repeat: -1,
            callbackScope: this
        });

        this.once(Phaser.GameObjects.Events.DESTROY, () => event.remove());

        scene.add.existing(this);
    }

    /**
     * Walk through X-axis to "moveX" pixels. Time will be calculated from distance
     *
     * @param moveX
     */
    public walk(moveX: number): Promise<void> {
        return new Promise((resolve) => {
            const y = this.y;

            const walkingTween = this.scene.tweens.add({
                targets: this,
                y: {
                    from: y + 5,
                    to: y - 5
                },
                yoyo: true,
                loop: -1,
                delay: 150,
                duration: 200,
                frameRate: 30,
            });

            const speed = 200;

            this.scene.tweens.add({
                targets: this,
                x: {
                    from: this.x,
                    to: moveX
                },
                delay: 150,
                duration: (moveX + Math.abs(this.x)) / speed * 1000,
                onComplete: () => {
                    this.anims.stop();
                    this.anims.play('tom-walking-end');
                    walkingTween.stop();

                    resolve();
                }
            });

            this.play('tom-walk-start')
                .once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.play({
                        key: 'tom-walking',
                        repeat: -1,
                    });
                });
            });
    }

    /**
     * Anims setup
     */
    protected createAnims() {
        const tomFrames = this.anims.generateFrameNames('tom');
        this.anims.create({
            key: 'tom-walk-start',
            frames: tomFrames.slice(0, 6)
        });

        this.anims.create({
            key: 'tom-walking',
            frames: tomFrames.slice(7, this.texture.frameTotal - Tom.BLINK_ANIM_FRAMES_COUNT - Tom.END_WALK_FRAMES_COUNT - 1)
        });

        this.anims.create({
            key: 'tom-walking-end',
            frames: tomFrames.slice(this.texture.frameTotal - Tom.BLINK_ANIM_FRAMES_COUNT - Tom.END_WALK_FRAMES_COUNT - 1)
        });

        this.anims.create({
            key: 'tom-blink',
            frames: tomFrames.slice(this.texture.frameTotal - Tom.BLINK_ANIM_FRAMES_COUNT - 1),
        });
    }

    public destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene);

        this.scene.tweens.getTweensOf(this).forEach((tween) => {
            tween.remove();
        });
    }
}

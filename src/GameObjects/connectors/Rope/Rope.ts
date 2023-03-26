import { IConnectorObject } from "@interfaces/IConnectorObject";
import { GameObjectsScene } from "@src/scenes/GameObjectsScene";

/**
 * Rope game object
 */
export class Rope extends Phaser.GameObjects.Graphics {

    /**
     * Update tween
     */
    protected tween: Phaser.Tweens.Tween;

    /**
     * Ctor
     */
    constructor(
        scene: GameObjectsScene,
        protected firstConnector: IConnectorObject,
        protected secondConnector: IConnectorObject
    ) {
        super(scene, {
            lineStyle: {
                width: 10,
                color: 0xDD9900,
                alpha: 1,
            }
        });

        scene.add.existing(this);

        this.tween = this.scene.tweens.addCounter({
            loop: -1,
            useFrames: true,
            duration: 1,
            onUpdate: () => {
                this.clear();
                const coordsFrom = this.firstConnector.getSocketPosition();
                const coordsTo = this.secondConnector.getSocketPosition();

                this.lineBetween(
                    coordsFrom.x,
                    coordsFrom.y,
                    coordsTo.x,
                    coordsTo.y
                );
            }
        });
    }

    public destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene);

        this.tween.remove();

        // @ts-ignore
        this.tween = null;
    }
}

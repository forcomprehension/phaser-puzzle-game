import { ActiveGameObject, BaseGameScene } from "@src/scenes/BaseGameScene";

/**
 * Base class for all dashboard presenters
 */
export abstract class AbstractDashboardPresenter extends Phaser.GameObjects.Image {
    /**
     * Ctor
     */
    constructor(
        scene: BaseGameScene,
        protected boundTool: ActiveGameObject,
        icon: string,
        x: number,
        y: number,
    ) {
        super(scene, x, y, icon);

        this.boundTool.onDeactivateTool(() => {
            this.clearTint();
        });

        this.boundTool.onActivateTool(() => {
            this.tint = 0xFF0000;
        });

        this.setInteractive({
            useHandCursor: true
        }).on(Phaser.Input.Events.POINTER_UP, () => {
            if (this.boundTool !== scene.getCurrentActiveObject()) {
                scene.switchActiveGameObject(this.boundTool);
            } else {
                scene.switchActiveGameObject(null);
            }
        });

        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            this.off(Phaser.Input.Events.POINTER_UP);
        });
    }
}


import { ActiveGameObject, BaseGameScene } from "@src/scenes/BaseGameScene";

/**
 * Base class for all dashboard presenters
 */
export abstract class AbstractDashboardPresenter extends Phaser.GameObjects.Image {

    // @TODO: Render stack count
    /**
     * Number of items in the stack
     */
    protected stackCount: number = 1;

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
                scene.activateGameObject(this.boundTool);
            } else {
                scene.deactivateGameObject(this.boundTool);
            }
        });

        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            this.off(Phaser.Input.Events.POINTER_UP);
        });
    }

    /**
     * @param newCount
     */
    public setStackCount(newCount: number) {
        this.stackCount = newCount;
    }

    /**
     * Get count of current item
     */
    public getStackCount() {
        return this.stackCount;
    }

    /**
     * Use one item from stack
     */
    public useItem() {
        if (this.stackCount < 1) {
            return false;
        }

        this.stackCount--;

        if (this.stackCount === 0) {
            // @TODO: use gameobject pool
            this.destroy();
        }

        return true;
    }

    public destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene);

        // @ts-ignore
        this.boundTool = undefined;
    }
}


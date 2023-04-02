import { ActiveGameObject, BaseGameScene } from "@src/scenes/BaseGameScene";

/**
 * Base class for all dashboard presenters
 */
export abstract class AbstractDashboardPresenter extends Phaser.GameObjects.Image {
    /**
     * Number of items in the stack
     */
    protected stackCount: number = 1;

    /**
     * Stack count renderer
     */
    protected stackCountRenderer: Phaser.GameObjects.Text;

    /**
     * Stack count renderer offset
     *
     * @TODO: Dynamic?
     */
    protected static STACK_COUNT_OFFSET: Readonly<Vector2Like> = Object.freeze({
        x: -55,
        y: 25
    });

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

        this.stackCountRenderer = this.scene.make.text({
            text: '0',
            x: this.x + AbstractDashboardPresenter.STACK_COUNT_OFFSET.x,
            y: this.y + AbstractDashboardPresenter.STACK_COUNT_OFFSET.y,
            style: {
                fontSize: '24px',
                fontStyle: 'bold'
            }
        });

        this.on(Phaser.GameObjects.Events.ADDED_TO_SCENE, () => {
            this.stackCountRenderer.setText(String(this.stackCount));
            this.scene.add.existing(this.stackCountRenderer);
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
        this.stackCountRenderer.setText(String(this.stackCount));
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

        this.setStackCount(this.stackCount - 1);

        if (this.stackCount === 0) {
            // @TODO: use gameobject pool
            this.setActive(false);
        }

        return true;
    }

    /**
     * Return object into the stack
     */
    public returnObject() {
        this.setStackCount(this.stackCount + 1);
        this.setActive(true);
    }

    public destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene);

        // @ts-ignore
        this.boundTool = undefined;
    }
}


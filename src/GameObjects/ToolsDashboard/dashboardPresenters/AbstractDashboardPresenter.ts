import { ActiveGameObject, BaseGameScene } from "@src/scenes/BaseGameScene";

/**
 * Base class for all dashboard presenters
 */
export abstract class AbstractDashboardPresenter extends Phaser.GameObjects.Container {

    /**
     * Number of items in the stack
     */
    protected stackCount: number = 1;

    /**
     * Stack count renderer
     */
    protected stackCountRenderer: Phaser.GameObjects.Text;

    /**
     * Image renderer
     */
    protected icon: Phaser.GameObjects.Image;

    /**
     * Hitzone for this container events
     */
    protected hitZone: Phaser.GameObjects.Zone;

    /**
     * Stack count renderer offset
     *
     * @TODO: Dynamic?
     */
    protected static STACK_COUNT_OFFSET: Readonly<Vector2Like> = Object.freeze({
        x: 10,
        y: 20
    });

    // @TODO: normal keys
    public get toolKey() {
        return this.constructor.name;
    }

    /**
     * Ctor
     */
    constructor(
        scene: BaseGameScene,
        protected boundTool: ActiveGameObject,
        icon: string | [string, string | number | undefined],
        x: number,
        y: number,
    ) {
        super(scene, x, y);

        const [ texture, frame ] = Array.isArray(icon) ? icon : [icon];
        this.icon = scene.add.image(0, 0, texture, frame).setOrigin(0);

        this.boundTool.onDeactivateTool(() => {
            this.icon.clearTint();
        });

        this.boundTool.onActivateTool(() => {
            this.icon.tint = 0xFF0000;
        });

        this.stackCountRenderer = this.scene.make.text({
            text: '0',
            x: 0,
            y: 0,
            style: {
                fontSize: '48px',
                fontStyle: 'bold'
            }
        });

        this.on(Phaser.GameObjects.Events.ADDED_TO_SCENE, () => {
            // Set count after init
            this.stackCountRenderer.setText(String(this.stackCount));

            // Set position of stack count renderer
            this.stackCountRenderer.setPosition(
                AbstractDashboardPresenter.STACK_COUNT_OFFSET.x,
                this.icon.displayHeight + AbstractDashboardPresenter.STACK_COUNT_OFFSET.y,
            );
        });

        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            this.off(Phaser.Input.Events.POINTER_UP);
        });

        this.add(this.icon);
        this.add(this.stackCountRenderer);
    }

    public afterAdd() {
        const scene = this.scene as BaseGameScene;
        const { width, height } = this.getBounds();
        this.hitZone = this.scene.add.zone(this.x, this.y, width, height)
            .setOrigin(0);

        this.hitZone.setInteractive({
            useHandCursor: true
        }).on(Phaser.Input.Events.POINTER_UP, () => {
            if (this.boundTool !== scene.getCurrentActiveObject()) {
                scene.activateGameObject(this.boundTool);
            } else {
                scene.deactivateGameObject(this.boundTool);
            }
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
            this.setVisible(false);
        }

        return true;
    }

    /**
     * Return object into the stack
     */
    public returnObject() {
        this.setStackCount(this.stackCount + 1);
        this.setActive(true);
        this.setVisible(true);
    }

    public destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene);
        this.hitZone.destroy(fromScene);
        this.stackCountRenderer.destroy(fromScene);
        this.icon.destroy(fromScene);

        // @ts-ignore
        this.boundTool = this.icon = this.hitZone = this.stackCountRenderer = undefined;
    }
}


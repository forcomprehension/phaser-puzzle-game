import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractGameObjectSpawner } from "../AbstractGameObjectSpawner";
import { DASHBOARD_PRESENTER_HIDE, DASHBOARD_PRESENTER_SHOW } from "./events";
import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";

/**
 * Base class for all dashboard presenters
 */
export abstract class AbstractDashboardPresenter extends Sizer {

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
     * Stack count renderer offset
     *
     * @TODO: Dynamic?
     */
    protected static STACK_COUNT_OFFSET: Readonly<Vector2Like> = Object.freeze({
        x: 10,
        y: 20
    });

    // @TODO: normal keys
    public getToolKey() {
        return this.constructor.name;
    }

    /**
     * Hack for types
     *
     * @inheritdoc
     */
    public onCreateModalBehavior: (self: AbstractDashboardPresenter) => void;

    /**
     * Ctor
     */
    constructor(
        public scene: BaseGameScene,
        protected spawner: AbstractGameObjectSpawner,
        icon: string | [string, string | number | undefined],
    ) {
        super(scene, 0, 0);

        const [ texture, frame ] = Array.isArray(icon) ? icon : [icon];
        this.icon = scene.add.image(0, 0, texture, frame).setOrigin(0);

        this.spawner.onDeactivateTool(() => {
            this.icon.clearTint();
        });

        this.spawner.onActivateTool(() => {
            this.icon.tint = 0xFF0000;
        });

        this.stackCountRenderer = this.scene.make.text({
            text: '0',
            x: 0,
            y: 0,
            style: {
                fontSize: '24px',
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

    /**
     * Sets a new scale for icon
     *
     * @TODO: need?
     *
     * @param scale
     */
    protected setIconScale(scale: number) {
        this.icon.setScale(scale);
    }

    public handleClick() {
        if (this.spawner !== this.scene.getCurrentActiveObject()) {
            this.scene.activateGameObject(this.spawner);
        } else {
            this.scene.deactivateGameObject(this.spawner);
        }
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
            this.hideObject();
        }

        return true;
    }

    /**
     * Hides object, if is non-useful
     */
    protected hideObject() {
        this.setActive(false);
        this.setVisible(false);
        this.emit(DASHBOARD_PRESENTER_HIDE);
    }

    /**
     * Shows object, if it is hidden
     */
    protected showObject() {
        this.setActive(true);
        this.setVisible(true);
        this.emit(DASHBOARD_PRESENTER_SHOW);
    }

    /**
     * Return object into the stack
     */
    public returnObject(gameObject: Phaser.GameObjects.GameObject) {
        this.scene.activateGameObject(this.spawner);
        this.spawner.onReturnItem(gameObject);

        this.setStackCount(this.stackCount + 1);
        this.showObject();

        this.scene.deactivateGameObject(this.spawner);
    }

    public destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene);
        this.stackCountRenderer.destroy(fromScene);
        this.icon.destroy(fromScene);
        // @TODO: events?

        // @ts-ignore
        this.spawner = this.icon = this.stackCountRenderer = undefined;
    }
}


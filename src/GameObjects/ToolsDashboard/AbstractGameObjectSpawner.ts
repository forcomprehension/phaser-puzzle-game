import { IActiveTool } from "@interfaces/IActiveTool";
import { AbstractDashboardPresenter } from "./dashboardPresenters/AbstractDashboardPresenter";
import { EVENT_ON_ACTIVATE_TOOL, EVENT_ON_DEACTIVATE_TOOL } from "@src/constants/tools";
import { BaseGameScene } from "@src/scenes/BaseGameScene";

/**
 * Superclass of all spawners
 */
export abstract class AbstractGameObjectSpawner extends Phaser.GameObjects.GameObject implements IActiveTool {
    /**
     * Cast type
     */
    public scene: BaseGameScene;

    /**
     * If true, hooks spawn on onClick event
     */
    protected bindSpawnToOnClick: boolean = true;

    /**
     * @todo: kostyl
     */
    protected isActiveTool: boolean = false;

    /**
     * Guard for case when we activate/deactivate during 1 macrotask
     */
    protected isWait: boolean = false;

    /**
     * Binded dashbpard presenter
     */
    protected dashboardPresenter: AbstractDashboardPresenter;

    /**
     * Setter for dashboard presenter
     *
     * @param presenter
     */
    public setDashboardPresenter(presenter: AbstractDashboardPresenter) {
        this.dashboardPresenter = presenter;
    }

    /**
     * Activate tool from IActiveTool
     */
    public activateTool(): void {
        if (this.bindSpawnToOnClick) {
            this.scene.input
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.tryToUseItem, this);
        }

        this.emit(EVENT_ON_ACTIVATE_TOOL);

        // @todo: набор костылей для замены click stopPropagation
        this.isWait = true;
        Promise.resolve().then(() => {
            if (this.isWait) {
                this.isActiveTool = true;
            }
        });
    }

    /**
     * Deactivate tool from IActiveTool
     */
    public deactivateTool(): void {
        if (this.bindSpawnToOnClick) {
            this.scene.input
                .off(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.tryToUseItem, this);
        }

        this.emit(EVENT_ON_DEACTIVATE_TOOL);

        this.isActiveTool = false;
        this.isWait = false;
    }

    /**
     * Hook onDeactivateTool
     *
     * @todo: rework
     *
     * @param cb
     */
    public onDeactivateTool(cb: Function): void {
        this.on(EVENT_ON_DEACTIVATE_TOOL, cb);
    }

    /**
     * Hook onActivateTool
     *
     * @todo: rework
     *
     * @param cb
     */
    public onActivateTool(cb: Function): void {
       this.on(EVENT_ON_ACTIVATE_TOOL, cb);
    }

    /**
     * Calls on return item
     *
     * @param gameObject
     */
    public onReturnItem(gameObject: Phaser.GameObjects.GameObject) {
    }

    /**
     * Use item in dashboard presenter if can. Call abstract "spawnItem" and "onResetValues"
     *
     * @param pointer
     */
    public tryToUseItem(pointer: Phaser.Input.Pointer) {
        // @TODO: kostyl for prevent spawning in dashboard
        if (pointer.x >= this.scene.getCanvasSize().canvasWidth - 300) {
            console.warn(this.constructor.name + ' has spawn attempt.');
            return;
        }

        if (this.dashboardPresenter && this.isActiveTool) {
            const last = this.dashboardPresenter.getStackCount() === 1;
            if (this.dashboardPresenter.useItem()) {
                this.spawnItem(pointer);
            }

            this.onResetValues();

            if (last) {
                this.scene.deactivateGameObject(this);
                // @TODO: object pool
                this.setActive(false);
            }
        }
    }

    /**
     * Fires when item is used in dashboard presenter
     *
     * @param pointer
     */
    protected abstract spawnItem(pointer: Phaser.Input.Pointer): void;

    /**
     * If we need reset values
     */
    public onResetValues() {}

    /**
     * Dtor
     *
     * @param fromScene
     */
    public destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene);

        // @ts-ignore
        this.dashboardPresenter = null;
    }
}

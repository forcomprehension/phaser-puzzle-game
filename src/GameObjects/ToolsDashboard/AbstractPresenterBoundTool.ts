import { IActiveTool } from "@interfaces/IActiveTool";
import { AbstractDashboardPresenter } from "./dashboardPresenters/AbstractDashboardPresenter";
import { EVENT_ON_ACTIVATE_TOOL, EVENT_ON_DEACTIVATE_TOOL } from "@src/constants/tools";
import { BaseGameScene } from "@src/scenes/BaseGameScene";

/**
 * Superclass of all presenter bound tools
 */
export abstract class AbstractPresenterBoundTool extends Phaser.GameObjects.GameObject implements IActiveTool {

    /**
     * Cast type
     */
    public scene: BaseGameScene;

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
        this.isWait = true;
        this.emit(EVENT_ON_ACTIVATE_TOOL);

        // @todo: набор костылей для замены click stopPropagation
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
     * Use item in dashboard presenter if can. Call abstract "onUseItem" and "onResetValues"
     *
     * @param pointer
     */
    public tryToUseItem(pointer: Phaser.Input.Pointer) {
        if (this.dashboardPresenter && this.isActiveTool) {
            const last = this.dashboardPresenter.getStackCount() === 1;
            if (this.dashboardPresenter.useItem()) {
                this.onUseItem(pointer);
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
    protected abstract onUseItem(pointer: Phaser.Input.Pointer): void;

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

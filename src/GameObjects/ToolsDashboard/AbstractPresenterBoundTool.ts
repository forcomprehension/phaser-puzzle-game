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
    public isActiveTool: boolean = false;

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

    public activateTool(): void {
        this.emit(EVENT_ON_ACTIVATE_TOOL);
    }

    public deactivateTool(): void {
        this.emit(EVENT_ON_DEACTIVATE_TOOL);
    }

    public onDeactivateTool(cb: Function): void {
        this.on(EVENT_ON_DEACTIVATE_TOOL, cb);

        this.isActiveTool = false;
    }

    public onActivateTool(cb: Function): void {
       this.on(EVENT_ON_ACTIVATE_TOOL, cb);

       this.isActiveTool = true;
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

    public destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene);

        // @ts-ignore
        this.dashboardPresenter = null;
    }
}

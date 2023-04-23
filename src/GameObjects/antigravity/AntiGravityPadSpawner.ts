import { AbstractDashboardPresenter } from "@GameObjects/ToolsDashboard/dashboardPresenters/AbstractDashboardPresenter";
import { IActiveTool } from "@interfaces/IActiveTool";
import { EVENT_ON_DEACTIVATE_TOOL } from "@src/constants/tools";
import { EVENT_ON_ACTIVATE_TOOL } from "@src/constants/tools";
import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AntiGravityPad } from "./AntiGravityPad";

export class AntiGravityPadSpawner extends Phaser.GameObjects.GameObject implements IActiveTool {

    protected dashboardPresenter: AbstractDashboardPresenter;

    public isActiveTool: boolean = false;

    constructor(public scene: BaseGameScene) {
        super(scene, AntiGravityPadSpawner.name);
    }

    public setDashboardPresenter(presenter: AbstractDashboardPresenter) {
        this.dashboardPresenter = presenter;
    }

    activateTool(): void {
        setTimeout(() => {
            this.scene.input
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.spawn, this);
        });

        this.emit(EVENT_ON_ACTIVATE_TOOL);
    }

    deactivateTool(): void {
        this.scene.input
            .off(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.spawn);

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

    public spawn(pointer: Phaser.Input.Pointer) {
        if (this.dashboardPresenter && this.isActiveTool) {
            const last = this.dashboardPresenter.getStackCount() === 1;
            if (this.dashboardPresenter.useItem()) {
                new AntiGravityPad(this.scene, pointer.x, pointer.y);
            }

            if (last) {
                this.scene.deactivateGameObject(this);
                // @TODO: object pool
                this.setActive(false);
            }
        }
    }
}
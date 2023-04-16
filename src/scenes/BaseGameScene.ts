import { DrivingBeltDrawerTool } from "@GameObjects/connectors/DrivingBelt/DrivingBeltDrawerTool";
import { DrivingBeltDashboardPresenter } from "@GameObjects/dashboardPresenters/DrivingBeltDashboardPresenter";
import { IActiveTool } from "@interfaces/IActiveTool";

/**
 * Current active gameobject
 */
export type ActiveGameObject = Phaser.GameObjects.GameObject & IActiveTool;

/**
 * Base scene for gameplay
 */
export class BaseGameScene extends Phaser.Scene {
    /**
     * Current active tool
     */
    protected currentActiveObject: Nullable<ActiveGameObject> = null;

    public drivingBeltDrawer: DrivingBeltDrawerTool;

    public create() {
        const drivingBeltDrawer = this.drivingBeltDrawer = new DrivingBeltDrawerTool(this);
        const drivingBeltPresenter = new DrivingBeltDashboardPresenter(this, drivingBeltDrawer, 1700, 200);

        drivingBeltDrawer.setDashboardPresenter(drivingBeltPresenter);

        this.add.existing(drivingBeltPresenter);
        this.add.existing(drivingBeltDrawer);
    }

    /**
     * Switch to another active gameobject
     *
     * @param newGameObject
     */
    public activateGameObject(newGameObject: ActiveGameObject) {
        if (this.currentActiveObject) {
            this.currentActiveObject.deactivateTool();
        }

        this.currentActiveObject = newGameObject;
        this.currentActiveObject.activateTool();
    }

    /**
     * Will be deactivated if matches current object
     */
    public deactivateGameObject(targetObject: ActiveGameObject) {
        if (this.currentActiveObject && targetObject === this.currentActiveObject) {
            this.currentActiveObject.deactivateTool();
            this.currentActiveObject = null;
        }
    }

    /**
     * Does scene has active game tool
     */
    public hasActiveGameObject() {
        return !!this.currentActiveObject;
    }

    /**
     * Returns this active object
     */
    public getCurrentActiveObject() {
        return this.currentActiveObject;
    }
}

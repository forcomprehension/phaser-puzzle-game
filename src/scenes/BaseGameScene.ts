import { RopeDrawerTool } from "@GameObjects/connectors/Rope/RopeDrawerTool";
import { RopeDashboardPresenter } from "@GameObjects/dashboardPresenters/RopeDashboardPresenter";
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

    public ropeDrawer: RopeDrawerTool;

    public create() {
        const ropeDrawer = this.ropeDrawer = new RopeDrawerTool(this);
        const ropePresenter = new RopeDashboardPresenter(this, ropeDrawer, 1700, 200);

        ropeDrawer.setDashboardPresenter(ropePresenter);

        this.add.existing(ropePresenter);
        this.add.existing(ropeDrawer);
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

import { DrivingBeltDrawerTool } from "@GameObjects/connectors/DrivingBelt/DrivingBeltDrawerTool";
import { DrivingBeltDashboardPresenter } from "@GameObjects/ToolsDashboard/dashboardPresenters/DrivingBeltDashboardPresenter";
import { IActiveTool } from "@interfaces/IActiveTool";
import { ToolsDashboard } from "@GameObjects/ToolsDashboard/ToolsDashboard";
import { AntiGravityPadSpawner } from "@GameObjects/antigravity/AntiGravityPadSpawner";
import { AntiGravityPadDashboardPresenter } from "@GameObjects/ToolsDashboard/dashboardPresenters/AntiGravityPadDashboardPresenter";


/**
 * Current active gameobject
 */
export type ActiveGameObject = Phaser.GameObjects.GameObject & IActiveTool;

/**
 * Base scene for gameplay
 */
export class BaseGameScene extends Phaser.Scene {
    public toolsDashboard: ToolsDashboard = new ToolsDashboard(this);

    /**
     * Current active tool
     */
    protected currentActiveObject: Nullable<ActiveGameObject> = null;

    public drivingBeltDrawer: DrivingBeltDrawerTool;

    public create() {
        this.toolsDashboard.init();
        const drivingBeltDrawer = this.drivingBeltDrawer = new DrivingBeltDrawerTool(this);
        const drivingBeltPresenter = new DrivingBeltDashboardPresenter(
            this, drivingBeltDrawer, 0, 0
        );

        drivingBeltDrawer.setDashboardPresenter(drivingBeltPresenter);

        this.add.existing(drivingBeltDrawer);
        this.add.existing(drivingBeltPresenter);

        const antiGravityPadSpawner = new AntiGravityPadSpawner(this);
        const antiGravityPresenter = new AntiGravityPadDashboardPresenter(
            this, antiGravityPadSpawner, 0, 200 // @TODO: FIX Y WITH GRID
        );

        antiGravityPadSpawner.setDashboardPresenter(antiGravityPresenter);

        this.add.existing(antiGravityPadSpawner);
        this.add.existing(antiGravityPresenter);

        this.toolsDashboard
            .register(drivingBeltPresenter)
            .register(antiGravityPresenter);

        this.toolsDashboard.seal();
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

    public getCanvasSize() {
        const { width, height } = this.sys.canvas;

        return {
            canvasWidth: width,
            canvasHeight: height,
        };
    }
}

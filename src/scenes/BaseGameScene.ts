import { DrivingBeltDrawerTool } from "@GameObjects/connectors/DrivingBelt/DrivingBeltDrawerTool";
import { DrivingBeltDashboardPresenter } from "@GameObjects/ToolsDashboard/dashboardPresenters/DrivingBeltDashboardPresenter";
import { IActiveTool } from "@interfaces/IActiveTool";
import { ToolsDashboard } from "@GameObjects/ToolsDashboard/ToolsDashboard";
import { AntiGravityPadSpawner } from "@GameObjects/antigravity/AntiGravityPadSpawner";
import { AntiGravityPadDashboardPresenter } from "@GameObjects/ToolsDashboard/dashboardPresenters/AntiGravityPadDashboardPresenter";
import { GearsManager, addGearsManagerTweens } from "@GameObjects/gears/GearsManager";
import { GearsSpawner } from "@GameObjects/gears/GearsSpawners/GearSpawner";
import { GearDashboardPresenter } from "@GameObjects/ToolsDashboard/dashboardPresenters/GearDashboardPresenter";
import { MotorSpawner } from "@GameObjects/motors/MotorSpawner";
import { MotorDashboardPresenter } from "@GameObjects/ToolsDashboard/dashboardPresenters/MotorDashboardPresenter";

/**
 * Current active gameobject
 */
export type ActiveGameObject = Phaser.GameObjects.GameObject & IActiveTool;

/**
 * Base scene for gameplay
 */
export class BaseGameScene extends Phaser.Scene {
    public gearsManager: GearsManager;
    public toolsDashboard: ToolsDashboard = new ToolsDashboard(this);

    /**
     * Current active tool
     */
    protected currentActiveObject: Nullable<ActiveGameObject> = null;

    public create() {
        this.initGearsManager();
        this.initDashboardTools();
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

    /**
     * Init gears manager system
     */
    protected initGearsManager() {
        this.gearsManager = new GearsManager(this);
        addGearsManagerTweens(this, this.gearsManager);
    }

    /**
     * Init dashboard tools
     */
    protected initDashboardTools() {
        // @todo: kostyl
        let currentYShift = 0;
        const getNextYShift = () => currentYShift = currentYShift + 170;

        this.toolsDashboard.init();

        // Driving belt
        const drivingBeltDrawer = new DrivingBeltDrawerTool(this);
        const drivingBeltPresenter = new DrivingBeltDashboardPresenter(
            this, drivingBeltDrawer, 0, 0
        );
        drivingBeltDrawer.setDashboardPresenter(drivingBeltPresenter);
        this.add.existing(drivingBeltDrawer);
        this.add.existing(drivingBeltPresenter);

        // Anti-gravity pad
        const antiGravityPadSpawner = new AntiGravityPadSpawner(this);
        const antiGravityPresenter = new AntiGravityPadDashboardPresenter(
            this, antiGravityPadSpawner, 0, getNextYShift() // @TODO: FIX Y WITH GRID
        );
        antiGravityPadSpawner.setDashboardPresenter(antiGravityPresenter);
        this.add.existing(antiGravityPadSpawner);
        this.add.existing(antiGravityPresenter);

        // Gear 6
        const gear6Spawner = new GearsSpawner(this, 'gear6');
        const gear6Presenter = new GearDashboardPresenter(this, gear6Spawner, 0, getNextYShift());
        gear6Spawner.setDashboardPresenter(gear6Presenter);
        this.add.existing(gear6Presenter);
        this.add.existing(gear6Spawner);

        // Gear 12
        const gear12Spawner = new GearsSpawner(this, 'gear12');
        const gear12Presenter = new GearDashboardPresenter(this, gear12Spawner, 0, getNextYShift());
        gear12Spawner.setDashboardPresenter(gear12Presenter);
        this.add.existing(gear12Presenter);
        this.add.existing(gear12Spawner);

        // Motor
        const motorSpawner = new MotorSpawner(this);
        const motorPresenter = new MotorDashboardPresenter(this, motorSpawner, 0, getNextYShift());
        motorSpawner.setDashboardPresenter(motorPresenter);
        this.add.existing(motorPresenter);
        this.add.existing(motorSpawner);

        // Registration
        this.toolsDashboard
            .register(drivingBeltPresenter)
            .register(antiGravityPresenter)
            .register(gear6Presenter)
            .register(gear12Presenter)
            .register(motorPresenter);

        this.toolsDashboard.seal();
    }

    /**
     * Canvas size getter helper
     */
    public getCanvasSize() {
        const { width, height } = this.sys.canvas;

        return {
            canvasWidth: width,
            canvasHeight: height,
        };
    }

    // @TODO: does it works like dtor?
    public destroy() {
        this.toolsDashboard.destroy();
    }
}

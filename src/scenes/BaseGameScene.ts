import type { IActiveTool } from "@interfaces/IActiveTool";
import { ToolsDashboard } from "@GameObjects/ToolsDashboard/ToolsDashboard";
import { GearsManager, addGearsManagerTweens } from "@GameObjects/gears/GearsManager";
import type RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { setupDashboard } from "./BaseGameScene/setupDashboard";

/**
 * Current active gameobject
 */
export type ActiveGameObject = Phaser.GameObjects.GameObject & IActiveTool;

/**
 * Base scene for gameplay
 */
export class BaseGameScene extends Phaser.Scene {
    public rexUI: RexUIPlugin;

    public gearsManager: GearsManager;
    public toolsDashboard: ToolsDashboard = new ToolsDashboard(this);

    /**
     * Current active tool
     */
    protected currentActiveObject: Nullable<ActiveGameObject> = null;

    /**
     * "Create" hook
     */
    public create() {
        this.initGearsManager();
        setupDashboard(this);

        this.events.on(Phaser.Scenes.Events.DESTROY, () => {
            this.destroy();
        })
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
     * Canvas size getter helper
     */
    public getCanvasSize() {
        const { width, height } = this.sys.canvas;

        return {
            canvasWidth: width,
            canvasHeight: height,
        };
    }

    public destroy() {
        this.toolsDashboard.destroy();
    }
}

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

    /**
     * Switch to another active gameobject
     *
     * @param newGameObject
     */
    public activateGameObject(newGameObject: Nullable<ActiveGameObject>) {
        if (this.currentActiveObject) {
            this.currentActiveObject.deactivateTool();
        }

        this.currentActiveObject = newGameObject;

        if (this.currentActiveObject) {
            this.currentActiveObject.activateTool();
        }
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

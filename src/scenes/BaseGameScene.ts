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
     * Switch to another acitve gameobject
     *
     * @param newGameObject
     */
    public switchActiveGameObject(newGameObject: Nullable<ActiveGameObject>) {
        if (this.currentActiveObject) {
            this.currentActiveObject.deactivateTool();
        }

        this.currentActiveObject = newGameObject;

        if (this.currentActiveObject) {
            this.currentActiveObject.activateTool();
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


/**
 * Interface for communication with scene.
 *
 * Useful, if scene determines when you can activate this gameObject.
 */
export interface IActiveTool {
    /**
     * Called when current tool is activated by scene
     */
    activateTool(): void;

    /**
     * Called when current tool is deactivated by scene
     */
    deactivateTool(): void;
}


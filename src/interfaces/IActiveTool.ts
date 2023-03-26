/**
 * Interface for communication with scene.
 *
 * Useful, if scene determines when you can activate this gameObject.
 *
 * @deprecated We must have only one place for activate/deactivate tool. Only in scene
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

    /**
     * Called when tool was deactivated
     *
     * @param cb
     */
    onDeactivateTool(cb: Function): void

    /**
     * Called when tool was activated
     *
     * @param cb
     */
    onActivateTool(cb: Function): void
}


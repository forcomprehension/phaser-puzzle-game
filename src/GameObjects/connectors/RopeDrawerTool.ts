import { IActiveTool } from "@interfaces/IActiveTool";

export class RopeDrawerTool extends Phaser.GameObjects.Graphics implements IActiveTool {

    /**
     * Drawer tween
     */
    protected tween: Phaser.Tweens.Tween;

    /**
     * Starts drawing from
     */
    protected startPoint: Nullable<Vector2Like> = null;

    /**
     * Drawing to
     */
    protected endPoint: Nullable<Vector2Like> = null;

    /**
     * Called on {@see deactivateTool}
     */
    protected onDeactivateCallback: Nullable<Function> = null;

    /**
     * Ctor
     */
    constructor(scene: Phaser.Scene) {
        super(scene, {
            lineStyle: {
                width: 10,
                color: 0xff0000,
                alpha: 1
            }
        });
    }

    public activateTool(): void {
        this.getDrawer().resume();

        this.scene.input
            .on(Phaser.Input.Events.POINTER_DOWN, this.handleStartDrawing, this)
            .on(Phaser.Input.Events.POINTER_MOVE, this.handleMoveCursor, this)
            .on(Phaser.Input.Events.POINTER_UP, this.handleEndDrawing, this)
            .on(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.handleEndDrawing, this);
    }

    public deactivateTool(): void {
        this.getDrawer().pause();
        this.clear();

        this.scene.input
            .off(Phaser.Input.Events.POINTER_DOWN, this.handleStartDrawing)
            .off(Phaser.Input.Events.POINTER_MOVE, this.handleMoveCursor)
            .off(Phaser.Input.Events.POINTER_UP, this.handleEndDrawing)
            .off(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.handleEndDrawing);
    }

    /**
     * Drawer for the line
     *
     * @returns
     */
    protected getDrawer() {
        /**
         * @TODO: Share?
         */
        if (!this.tween) {
            this.tween = this.scene.tweens.addCounter({
                loop: -1,
                paused: true,
                duration: 1,
                useFrames: true,
                onUpdate: () => {
                    this.drawRope();
                }
            });
        }

        return this.tween;
    }

    /**
     * "Update" method
     */
    protected drawRope() {
        this.clear();

        if (this.startPoint && this.endPoint) {
            this.lineBetween(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
        }
    }

    protected handleStartDrawing(pointer: any) {
        this.startPoint = {
            x: pointer.x,
            y: pointer.y
        };
    }

    protected handleMoveCursor(pointer: any) {
        this.endPoint = {
            x: pointer.x,
            y: pointer.y
        };
    }

    protected handleEndDrawing() {
        this.startPoint = null;
        this.endPoint = null;
    }
}

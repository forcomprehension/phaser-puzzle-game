import { RopeDashboardPresenter } from "@GameObjects/dashboardPresenters/RopeDashboardPresenter";
import { IActiveTool } from "@interfaces/IActiveTool";
import { IConnectionSocket } from "@interfaces/IConnectionSocket";
import { IConnectorObject } from "@interfaces/IConnectorObject";
import { EVENT_ON_ACTIVATE_TOOL, EVENT_ON_DEACTIVATE_TOOL } from "@src/constants/tools";
import { getGameObjectForConnectorsByBody } from "@src/physics/physicsHelpers";
import { GameObjectsScene } from "@src/scenes/GameObjectsScene";
import { Rope } from "./Rope";

type RopeConnectionSlots = {
    left: IConnectionSocket & IConnectorObject,
    right: Nullable<IConnectionSocket & IConnectorObject>
};

/**
 * Tool for drawing supposed rope position
 */
export class RopeDrawerTool extends Phaser.GameObjects.Graphics implements IActiveTool {

    /**
     * @inheritdoc
     */
    public scene: GameObjectsScene;

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
     * Connection slots for rope
     */
    protected ropeSlots: Nullable<RopeConnectionSlots> = null;

    /**
     * Dashboard presenter
     */
    protected dashboardPresenter: Nullable<RopeDashboardPresenter> = null;

    /**
     * Ctor
     */
    constructor(
        scene: GameObjectsScene
    ) {
        super(scene, {
            lineStyle: {
                width: 10,
                color: 0xff0000,
                alpha: 1
            }
        });
    }

    /**
     * Dashboard presenter dependency
     *
     * @param presenter
     */
    public setDashboardPresenter(presenter: RopeDashboardPresenter) {
        this.dashboardPresenter = presenter;
    }

    public onDeactivateTool(cb: Function): void {
        this.on(EVENT_ON_DEACTIVATE_TOOL, cb);
    }


    public onActivateTool(cb: Function): void {
       this.on(EVENT_ON_ACTIVATE_TOOL, cb);
    }

    public activateTool() {
        this.getDrawer().resume();

        // @TODO: pointerup is unreliable
        this.scene.input
            .on(Phaser.Input.Events.POINTER_UP, this.handleMakeConnection, this)
            .on(Phaser.Input.Events.POINTER_MOVE, this.handleMoveCursor, this)

        this.emit(EVENT_ON_ACTIVATE_TOOL);
    }

    public deactivateTool(): void {
        this.resetRopeDrawing();
        this.getDrawer().pause();
        this.clear();

        this.scene.input
            .off(Phaser.Input.Events.POINTER_UP, this.handleMakeConnection)
            .off(Phaser.Input.Events.POINTER_MOVE, this.handleMoveCursor);

        this.emit(EVENT_ON_DEACTIVATE_TOOL);
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

    /**
     * @param pointer
     */
    public handleMakeConnection(pointer: Phaser.Input.Pointer) {
        const connector = this.getConnectorFromPointer(pointer);

        if (connector && !connector.getSocketIsBusy()) {
            // Doesn't have first slot
            if (!this.ropeSlots?.left) {
                this.ropeSlots = {
                    left: connector,
                    right: null,
                };

                this.startPoint = connector.getSocketLocation();
                // Have first slot but haven't second
            } else if (this.ropeSlots.left && !this.ropeSlots?.right) {
                this.ropeSlots.right = connector;

                // Extra check, just in case
                if (this.ropeSlots.left.getSocketIsBusy() || this.ropeSlots.right.getSocketIsBusy()) {
                    console.warn('One of rope slots sockets already busy');
                    return;
                }

                this.handleSpawnRope();
            }

        // If we doesn't click on connector, but we already connected to at least one of connector
        } else if (!this.ropeSlots?.right) {
            // Reset if already drawing
            this.resetRopeDrawing();
        }
    }

    /**
     * Spawn concrete rope
     */
    protected handleSpawnRope() {
        if (this.dashboardPresenter) {
             // @TODO: make better
            const last = this.dashboardPresenter.getStackCount() === 1;
            if (this.dashboardPresenter.useItem()) {
                new Rope(
                    this.scene,
                    this.ropeSlots!.left,
                    this.ropeSlots!.right!,
                );

                this.ropeSlots!.left.connectConnector();
                this.ropeSlots!.right!.connectConnector();
            }

            this.resetRopeDrawing();
            this.scene.deactivateGameObject(this);

            if (last) {
                // @TODO: object pool
                this.destroy();
            }
        }
    }

    /**
     * Handles drawing
     *
     * @param pointer
     */
    protected handleMoveCursor(pointer: Phaser.Input.Pointer) {
        if (this.ropeSlots?.left) {
            this.endPoint = {
                x: pointer.x,
                y: pointer.y
            };
        }
    }

    /**
     * Gets connector object from pointer
     *
     * @param pointer
     */
    protected getConnectorFromPointer(pointer: Phaser.Input.Pointer) {
        const bodies = this.scene.matter.intersectPoint(pointer.x, pointer.y);

        let connector: Optional<IConnectionSocket & IConnectorObject>;
        for (const body of bodies) {
            const gameObject = getGameObjectForConnectorsByBody(body);
            if (gameObject) {
                connector = gameObject;
                break;
            }
        }

        return connector;
    }

    /**
     * Resets drawing rope positions
     */
    protected resetRopeDrawing() {
        this.startPoint = null;
        this.endPoint = null;
        this.ropeSlots = null;
    }

    public destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene);

        this.tween.remove();

        // @ts-ignore
        this.dashboardPresenter = this.tween = null;

        this.off(EVENT_ON_ACTIVATE_TOOL);
        this.off(EVENT_ON_DEACTIVATE_TOOL);
    }
}

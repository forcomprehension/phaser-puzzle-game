import { RopeDashboardPresenter } from "@GameObjects/dashboardPresenters/RopeDashboardPresenter";
import { IActiveTool } from "@interfaces/IActiveTool";
import { IConnectionSocket } from "@interfaces/IConnectionSocket";
import { GameObjectDuplexConnector } from "@src/classes/GameObjectsDuplexConnector";
import { EVENT_ON_ACTIVATE_TOOL, EVENT_ON_DEACTIVATE_TOOL } from "@src/constants/tools";
import { getGameObjectForConnectorsByBody } from "@src/physics/physicsHelpers";
import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { Rope } from "./Rope";

type RopeConnectionSlots = {
    left: IConnectionSocket,
    right: Nullable<IConnectionSocket>
};

/**
 * Tool for drawing supposed rope position
 */
export class RopeDrawerTool extends Phaser.GameObjects.Graphics implements IActiveTool {

    /**
     * @inheritdoc
     */
    public scene: BaseGameScene;

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
     * @TODO:
     */
    protected requestToReturn: boolean = false;

    /**
     * Ctor
     */
    constructor(
        scene: BaseGameScene
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
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleMakeConnection, this)
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_MOVE, this.handleMoveCursor, this)

        this.emit(EVENT_ON_ACTIVATE_TOOL);
    }

    public deactivateTool(): void {
        this.resetRopeValues();
        this.getDrawer().pause();
        this.clear();

        this.scene.input
            .off(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleMakeConnection)
            .off(Phaser.Input.Events.GAMEOBJECT_POINTER_MOVE, this.handleMoveCursor);

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
            if (this.requestToReturn) {
                this.returnToPresenter();
                // check why click is clickable
                // @TODO: must not be here
                this.scene.deactivateGameObject(this);
            }

            // Reset if already drawing
            this.resetRopeValues();
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
                // Acquire connection
                const connector = new GameObjectDuplexConnector(
                    this.ropeSlots!.left,
                    this.ropeSlots!.right!
                );

                new Rope(this.scene, connector);
            }

            this.resetRopeValues();

            if (last) {
                this.scene.deactivateGameObject(this);
                // @TODO: object pool
                this.setActive(false);
            }
        }
    }

    protected returnToPresenter() {
        if (this.dashboardPresenter) {
            this.dashboardPresenter.returnObject();
        }
    }

    public returnRope() {
        // @TODO: What if we already have an request?
        this.requestToReturn = true;
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

        let connector: Optional<IConnectionSocket>;
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
    protected resetRopeValues() {
        this.startPoint = null;
        this.endPoint = null;
        this.ropeSlots = null;
        this.requestToReturn = false;
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

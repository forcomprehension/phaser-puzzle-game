import { IConnectionSocket } from "@interfaces/IConnectionSocket";
import { GameObjectDuplexConnector } from "@src/classes/GameObjectsDuplexConnector";
import { EVENT_ON_ACTIVATE_TOOL, EVENT_ON_DEACTIVATE_TOOL } from "@src/constants/tools";
import { getGameObjectForConnectorsByBody } from "@src/physics/physicsHelpers";
import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { DrivingBelt } from "./DrivingBelt";
import { AbstractPresenterBoundTool } from "@GameObjects/ToolsDashboard/AbstractPresenterBoundTool";

type DrivingBeltConnectionSlots = {
    left: IConnectionSocket,
    right: Nullable<IConnectionSocket>
};

/**
 * Tool for drawing supposed driving belt position
 */
export class DrivingBeltDrawerTool extends AbstractPresenterBoundTool {

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
     * Connection slots for drivingBelt
     */
    protected drivingBeltSlots: Nullable<DrivingBeltConnectionSlots> = null;

    /**
     * Graphics object for drawing
     */
    protected graphicsObject: Phaser.GameObjects.Graphics;

    /**
     * Ctor
     */
    constructor(scene: BaseGameScene) {
        super(scene, DrivingBeltDrawerTool.name);

        this.graphicsObject = scene.add.graphics({
            lineStyle: {
                width: 10,
                color: 0xff0000,
                alpha: 1
            }
        });
    }

    public activateTool() {
        this.getDrawer().resume();

        // @TODO: pointerup is unreliable
        this.scene.input
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleMakeConnection, this)
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_MOVE, this.handleMoveCursor, this)

        super.activateTool();
    }

    public deactivateTool(): void {
        this.onResetValues();
        this.getDrawer().pause();
        this.graphicsObject.clear();

        this.scene.input
            .off(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleMakeConnection)
            .off(Phaser.Input.Events.GAMEOBJECT_POINTER_MOVE, this.handleMoveCursor);

        super.deactivateTool();
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
                    this.draw();
                }
            });
        }

        return this.tween;
    }

    /**
     * "Update" method
     */
    protected draw() {
        this.graphicsObject.clear();

        if (this.startPoint && this.endPoint) {
            this.graphicsObject.lineBetween(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
        }
    }

    /**
     * @param pointer
     */
    public handleMakeConnection(pointer: Phaser.Input.Pointer) {
        const connector = this.getConnectorFromPointer(pointer);

        if (connector && !connector.getSocketIsBusy()) {
            // Doesn't have first slot
            if (!this.drivingBeltSlots?.left) {
                this.drivingBeltSlots = {
                    left: connector,
                    right: null,
                };

                this.startPoint = connector.getSocketLocation();
                // Have first slot but haven't second
            } else if (
                this.drivingBeltSlots.left && !this.drivingBeltSlots?.right &&
                this.drivingBeltSlots.left !== connector
            ) {
                this.drivingBeltSlots.right = connector;

                // Extra check, just in case
                if (this.drivingBeltSlots.left.getSocketIsBusy() || this.drivingBeltSlots.right.getSocketIsBusy()) {
                    console.warn('One of belt slots sockets already busy');
                    return;
                }

                this.tryToUseItem(pointer);
            }

        // If we doesn't click on connector, but we already connected to at least one of connector
        } else if (!this.drivingBeltSlots?.right) {
            // Reset if already drawing
            this.onResetValues();
        }
    }

    public returnBelt() {
        if (this.dashboardPresenter) {
            this.dashboardPresenter.returnObject();
        }

        this.scene.deactivateGameObject(this);
        this.onResetValues();
    }

    /**
     * Handles drawing
     *
     * @param pointer
     */
    protected handleMoveCursor(pointer: Phaser.Input.Pointer) {
        if (this.drivingBeltSlots?.left) {
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
     * Spawn rope
     *
     * @param pointer
     */
    protected onUseItem(_: Phaser.Input.Pointer): void {
        // Acquire connection
        const connector = new GameObjectDuplexConnector(
            this.drivingBeltSlots!.left,
            this.drivingBeltSlots!.right!
        );

        new DrivingBelt(this.scene, connector);
    }

    /**
     * Resets drawing belt positions
     */
    public onResetValues() {
        super.onResetValues();

        this.startPoint = null;
        this.endPoint = null;
        this.drivingBeltSlots = null;
    }

    public destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene);
        this.graphicsObject.destroy(fromScene);

        this.tween.remove();

        // @ts-ignore
        this.graphicsObject = this.dashboardPresenter = this.tween = null;

        this.off(EVENT_ON_ACTIVATE_TOOL);
        this.off(EVENT_ON_DEACTIVATE_TOOL);
    }
}

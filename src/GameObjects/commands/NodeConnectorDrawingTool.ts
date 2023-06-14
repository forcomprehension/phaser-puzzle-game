import type { IConnectionSocket } from "@interfaces/IConnectionSocket";
import { GameObjectDuplexConnector } from "@src/classes/GameObjectsDuplexConnector";
import { EVENT_ON_ACTIVATE_TOOL, EVENT_ON_DEACTIVATE_TOOL } from "@src/constants/tools";
import { getGameObjectForConnectorsByBody } from "@src/physics/physicsHelpers";
import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { NodeConnector } from "./NodeConnector";
import { IActiveTool } from "@interfaces/IActiveTool";
import { NodePin } from "./NodePin";

type DrivingBeltConnectionSlots = {
    left: IConnectionSocket,
    right: Nullable<IConnectionSocket>
};

/**
 * Tool for drawing supposed driving belt position
 */
export class NodeConnectionDrawingTool extends Phaser.GameObjects.GameObject implements IActiveTool {

    /**
     * Cast type
     */
    public scene: BaseGameScene;

    /**
     * Drawer tween
     */
    protected tween: Phaser.Tweens.Tween;

    /**
     * @inheritdoc
     */
    protected bindSpawnToOnClick: boolean = false;

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
      * @todo: kostyl
      */
    protected isActiveTool: boolean = false;

     /**
      * Guard for case when we activate/deactivate during 1 macrotask
      */
    protected isWait: boolean = false;

    /**
     * If we drawing rope and waiting for connect
     */
    public get waitingForConnect(): boolean {
        return this.isActiveTool && !!this.drivingBeltSlots?.left && !this.drivingBeltSlots?.right;
    }

    /**
     * Ctor
     */
    constructor(scene: BaseGameScene) {
        super(scene, NodeConnectionDrawingTool.name);

        this.graphicsObject = scene.add.graphics({
            lineStyle: {
                width: 10,
                color: 0xff0000,
                alpha: 1
            }
        }).setDepth(1000);
    }

    /**
     * Use item in dashboard presenter if can. Call abstract "spawnItem" and "onResetValues"
     *
     * @param pointer
     */
    public tryToUseItem() {
        if (this.isActiveTool) {
            this.spawnItem();
            this.onResetValues();
            this.scene.deactivateGameObject(this);
            // @TODO: object pool
            this.setActive(false);
        }
    }

    public connectSecond(pin: NodePin) {
        if (this.drivingBeltSlots?.left === pin) {
            return;
        }

        this.drivingBeltSlots!.right = pin;
        this.tryToUseItem();
    }


    /**
     * Activate tool from IActiveTool
     */
    protected activateToolOld(): void {
        if (this.bindSpawnToOnClick) {
            this.scene.input
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.tryToUseItem, this);
        }

        this.emit(EVENT_ON_ACTIVATE_TOOL);

        // @todo: набор костылей для замены click stopPropagation
        this.isWait = true;
        Promise.resolve().then(() => {
            if (this.isWait) {
                this.isActiveTool = true;
            }
        });
    }

    /**
     * Deactivate tool from IActiveTool
     */
    protected deactivateToolOld(): void {
        if (this.bindSpawnToOnClick) {
            this.scene.input
                .off(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.tryToUseItem, this);
        }

        this.emit(EVENT_ON_DEACTIVATE_TOOL);

        this.isActiveTool = false;
        this.isWait = false;
    }

    /**
     * Hook onDeactivateTool
     *
     * @todo: rework
     *
     * @param cb
     */
    public onDeactivateTool(cb: Function): void {
        this.on(EVENT_ON_DEACTIVATE_TOOL, cb);
    }

    /**
     * Hook onActivateTool
     *
     * @todo: rework
     *
     * @param cb
     */
    public onActivateTool(cb: Function): void {
       this.on(EVENT_ON_ACTIVATE_TOOL, cb);
    }

    public activateTool() {
        this.getDrawer().resume();

        // @TODO: pointerup is unreliable
        this.scene.input
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleMakeConnection, this)
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_MOVE, this.handleMoveCursor, this)

        this.activateToolOld();
    }

    public deactivateTool(): void {
        this.onResetValues();
        this.getDrawer().pause();
        this.graphicsObject.clear();

        this.scene.input
            .off(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleMakeConnection)
            .off(Phaser.Input.Events.GAMEOBJECT_POINTER_MOVE, this.handleMoveCursor);

        this.deactivateToolOld();
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

    public handleStartDraw(pin: NodePin) {
        if (!pin.getSocketIsBusy()) {
            // Doesn't have first slot
            if (!this.drivingBeltSlots?.left) {
                this.drivingBeltSlots = {
                    left: pin,
                    right: null,
                };

                this.startPoint = pin.getSocketLocation();
                // Have first slot but haven't second
            } else if (
                this.drivingBeltSlots.left && !this.drivingBeltSlots?.right &&
                this.drivingBeltSlots.left !== pin
            ) {
                this.drivingBeltSlots.right = pin;

                // Extra check, just in case
                if (this.drivingBeltSlots.left.getSocketIsBusy() || this.drivingBeltSlots.right.getSocketIsBusy()) {
                    console.warn('One of belt slots sockets already busy');
                    return;
                }

                this.tryToUseItem();
            }
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

                this.tryToUseItem();
            }

        // If we doesn't click on connector, but we already connected to at least one of connector
        } else if (!this.drivingBeltSlots?.right) {
            // Reset if already drawing
            this.onResetValues();
        }
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
    protected spawnItem() {
        // Acquire connection
        const connector = new GameObjectDuplexConnector(
            this.drivingBeltSlots!.left,
            this.drivingBeltSlots!.right!
        );

        return new NodeConnector(this.scene, connector);
    }

    /**
     * Resets drawing belt positions
     */
    public onResetValues() {
        this.startPoint = null;
        this.endPoint = null;
        this.drivingBeltSlots = null;
    }

    public destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene);
        this.graphicsObject.destroy(fromScene);

        this.tween.remove();

        // @ts-ignore
        this.graphicsObject = this.tween = null;

        this.off(EVENT_ON_ACTIVATE_TOOL);
        this.off(EVENT_ON_DEACTIVATE_TOOL);
    }
}

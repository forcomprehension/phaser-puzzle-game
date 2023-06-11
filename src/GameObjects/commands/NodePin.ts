import { IConnectedObject } from "@interfaces/IConnectedObject";
import { IConnectionSocket } from "@interfaces/IConnectionSocket";
import { BodyLabel } from "@src/constants/collision";
import { INACTIVE_PIN_COLOR } from "@src/constants/colors";
import type { TestProgrammingScene } from "@src/scenes/TestProgrammingScene";
import { ON_PIN_CONNECTED, ON_PIN_DISCONNECTED } from "./nodepins/events";

/**
 * Node Pin for commands
 */
export class NodePin extends Phaser.GameObjects.Container implements IConnectionSocket, IConnectedObject {

    protected static readonly RADIUS = 20;

    public static readonly HEIGHT = this.RADIUS * 2;

    protected zone: Optional<Phaser.GameObjects.Zone>;
    protected circle: Optional<Phaser.GameObjects.Arc>;

    protected connectedObject: Nullable<IConnectedObject> = null;

    /**
     * Ctor
     */
    constructor(
        public scene: TestProgrammingScene,
        public readonly isRight: boolean,
    ) {
        super(scene, 0, 0);

        this.circle = this.scene.add.circle(0, 0, NodePin.RADIUS, INACTIVE_PIN_COLOR);
        const zone = this.zone = this.scene.add.zone(0, 0, NodePin.HEIGHT, NodePin.HEIGHT);
        const bodyObject = this.scene.matter.add.gameObject(this.circle);
        // @TODO:
        (bodyObject as Phaser.Physics.Matter.Sprite).setCircle(NodePin.RADIUS, {
            ignoreGravity: true,
            isSensor: true,
            isStatic: true,
            label: BodyLabel.NODE_PIN,
        });

        zone.setInteractive({
            useHandCursor: true,
            draggable: true,
        });

        zone.on(Phaser.Input.Events.POINTER_UP, this.onClick, this);

        this.add([this.circle, this.zone].map((gameObject) => {
            this.scene.add.existing(gameObject);
            return gameObject;
        }));

        this.scene.add.existing(this);
    }

    protected onClick() {
        if (!this.scene.hasActiveGameObject()) {
            this.scene.activateGameObject(this.scene.nodeConnectorDrawer);
            // @TODO:
            setTimeout(() => {
                this.scene.nodeConnectorDrawer.handleStartDraw(this);
            }, 60);
        } else if (this.scene.nodeConnectorDrawer.waitingForConnect) {
            // @TODO move this logic out
            this.scene.nodeConnectorDrawer.connectSecond(this);
        }
    }

    getBodyLabel(): BodyLabel {
        return BodyLabel.NODE_PIN;
    }

    getSocketLocation(): Vector2Like {
        return {
            x: this.parentContainer.x + this.x,
            y: this.parentContainer.y + this.y
        }
    }

    getSocketIsBusy(): boolean {
        return !!this.connectedObject;
    }
    getConnectorObject(): IConnectedObject {
        return this;
    }
    connectObject(targetObject: IConnectedObject, allConnected: boolean): void {
        this.connectedObject = targetObject;

        if (allConnected) {
            // @TODO: WHY ARGUMENTS COME IN REVERSED ORDER?
            this.emit(ON_PIN_CONNECTED, this, targetObject);
            // @TODO:
            (this.connectedObject as NodePin).emit(ON_PIN_CONNECTED, targetObject, this);
        }
    }
    disconnectObject(targetObject: IConnectedObject): void {
        if (this.connectedObject === targetObject) { // @TODO: needed?
            this.emit(ON_PIN_DISCONNECTED);
            this.connectedObject = null;
        }
    }

    public destroy(fromScene?: boolean | undefined): void {
        this.circle = undefined;

        super.destroy(fromScene);
    }
}

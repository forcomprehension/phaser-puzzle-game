import type { IConnectionSocket } from "@interfaces/IConnectionSocket";
import type { IConnectedObject } from "@interfaces/IConnectedObject";
import { BodyLabel } from "@src/constants/collision";
import type { ConstraintType } from "matter";
import { getMatterBody } from "../../physics/matter";
import { MotorPulley } from "./MotorPulley";
import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { MotorDashboardPresenter } from "@GameObjects/ToolsDashboard/dashboardPresenters/MotorDashboardPresenter";

/**
 * Creates a motor game object
 */
export class Motor extends Phaser.Physics.Matter.Image implements IConnectionSocket {
    /**
     * Pulley offset
     */
    protected static readonly PULLEY_OFFSET: Readonly<Vector2Like> = Object.freeze({
        x: -50,
        y: -20,
    });

    /**
     * Pulley subobject
     */
    protected readonly pulley: MotorPulley;

    /**
     * Pin joint for pulley
     */
    protected readonly pinJoint: ConstraintType;

    /**
     * Ctor
     */
    constructor(
        public scene: BaseGameScene,
        x: number,
        y: number
    ) {
        const texture = scene.textures.get('motor');
        const frameNames = texture.getFrameNames();
        const pulleyFrame = scene.textures.getFrame(texture.key, frameNames[1]);

        super(scene.matter.world, x, y, texture, frameNames[0], {
            ignoreGravity: true,
            isSensor: true,
            label: BodyLabel.MOTOR
        });

        scene.add.existing(this);

        this.pulley = new MotorPulley(
            this.scene.matter.world,
            x + Motor.PULLEY_OFFSET.x,
            y + Motor.PULLEY_OFFSET.y,
            pulleyFrame,
            this
        );

        this.setInteractive()
            .on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
                if (pointer.rightButtonDown()) {
                    if (this.pulley.getConnectedObject()) {
                        alert('Cannot return motor, because it has connected object');
                    } else {
                        this.handleReturn();
                    }
                }
            });

        this.pinJoint = scene.matter.add.constraint(getMatterBody(this), getMatterBody(this.pulley), 0, 1, {
            pointA: Motor.PULLEY_OFFSET,
            angularStiffness: 1
        });
    }

    public getConnectedObject(): Nullable<IConnectedObject> {
        return this.pulley.getConnectedObject();
    }

    protected handleReturn() {
        this.scene.toolsDashboard
            .get(MotorDashboardPresenter.name)
            .returnObject(this);

        this.destroy();
    }

    public getBodyLabel(): BodyLabel {
        return BodyLabel.MOTOR;
    }

    public connectObject(targetObject: IConnectedObject, allConnected: boolean): void {
        this.pulley.connectObject(targetObject);
    }

    public disconnectObject(_: IConnectedObject): void {
        this.pulley.disconnectObject();
    }

    public getConnectorObject(): IConnectedObject {
        return this.pulley;
    }

    /**
     * @inheritdoc
     */
    public getSocketLocation(): Vector2Like {
        const { x, y } = this.body.position;

        return {
            x: x + Motor.PULLEY_OFFSET.x,
            y: y + Motor.PULLEY_OFFSET.y
        };
    }

    /**
     * @inheritdoc
     */
    public getSocketIsBusy(): boolean {
        return !!this.pulley.getConnectedObject();
    }

    public destroy(fromScene?: boolean | undefined): void {
        this.scene.matter.world.removeConstraint(this.pinJoint);

        super.destroy(fromScene);
        this.pulley.destroy(fromScene);

        // @ts-ignore
        this.pinJoint = this.pulley = undefined;
    }
}

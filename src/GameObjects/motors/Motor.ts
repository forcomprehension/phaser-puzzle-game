import { IConnectionSocket } from "@interfaces/IConnectionSocket";
import { IConnectedObject } from "@interfaces/IConnectedObject";
import { BodyLabel } from "@src/constants/collision";
import type { ConstraintType } from "matter";
import { getMatterBody } from "../../physics/matter";
import { MotorPulley } from "./MotorPulley";

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
     * If something already connected
     */
    protected pulleyConnection: boolean = false;

    /**
     * Ctor
     */
    constructor(scene: Phaser.Scene, x: number, y: number) {
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

        this.pinJoint = scene.matter.add.constraint(getMatterBody(this), getMatterBody(this.pulley), 0, 1, {
            pointA: Motor.PULLEY_OFFSET,
            angularStiffness: 1
        });
    }

    public getBodyLabel(): BodyLabel {
        return BodyLabel.MOTOR;
    }

    public connectObject(targetObject: IConnectedObject): void {
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
}

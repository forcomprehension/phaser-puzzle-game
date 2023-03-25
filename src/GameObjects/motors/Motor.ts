import { ROTATION_DIRECTION } from "@utils/types";
import type { ConstraintType } from "matter";
import { castBody } from "../../physics/matter";

/**
 * Creates a motor game object
 */
export class Motor extends Phaser.Physics.Matter.Image {

    /**
     * Pulley subobject
     */
    protected readonly pulley: Phaser.Physics.Matter.Image;

    /**
     * Pin joint for pulley
     */
    protected readonly pinJoint: ConstraintType;

    /**
     * Current rotation direction
     */
    protected rotationDirection: ROTATION_DIRECTION = ROTATION_DIRECTION.IDLE;

    /**
     * If something already connected
     */
    protected pulleyConnection: boolean = true;

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
        });

        scene.add.existing(this);

        const pulleyOffset: Vector2Like = { x: -50, y: -20 };
        this.pulley = scene.matter.add.image(x + pulleyOffset.x, y + pulleyOffset.y, texture.key, frameNames[1], {
            ignoreGravity: true,
            isSensor: true,
            circleRadius: pulleyFrame.radius * .75 // @TODO:
        });

        this.pinJoint = scene.matter.add.constraint(castBody(this), castBody(this.pulley), 0, 1, {
            pointA: pulleyOffset
        });

        // @TODO: move
        scene.add.tween({
            targets: this.pulley,
            rotation: Phaser.Math.DegToRad(360),
            duration: 1000,
            loop: -1,
        });
    }

    /**
     * Lock/unlock constraint rotation
     */
    public toggleRotationLock(lock: boolean) {
        this.pinJoint.angularStiffness = Number(lock);
    }

    /**
     * Sets new rotation direction
     *
     * @param newDirection
     */
    public updateRotationDirection(newDirection: ROTATION_DIRECTION) {
        this.rotationDirection = newDirection;
    }
}
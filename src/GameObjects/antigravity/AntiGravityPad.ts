import { AntiGravityPadDashboardPresenter } from "@GameObjects/ToolsDashboard/dashboardPresenters/AntiGravityPadDashboardPresenter";
import { unsafeCastBody } from "@src/physics/matter";
import type { BaseGameScene } from "@src/scenes/BaseGameScene";

/**
 * Antigravity pad object
 */
export class AntiGravityPad extends Phaser.Physics.Matter.Sprite {

    /**
     * Influence height for anti-gravity pad zone
     */
    public static readonly INFLUENCE_HEIGHT = 650;

    /**
     * @todo
     */
    protected static readonly NON_GRAVITY_FORCE_MULTIPLIER = 0.001;

    /**
     * @todo
     */
    protected static readonly GRAVITY_FORCE_MULTIPLIER = 0.007;

    /**
     * Body for anti-gravity influence zone
     */
    protected influenceZone: MatterJS.BodyType;

    /**
     * Ctor
     *
     * @param scene
     * @param x
     * @param y
     */
    constructor(
        public scene: BaseGameScene,
        x: number,
        y: number
    ) {
        super(scene.matter.world, x, y, 'anti-gravity-pad', 4, {
            ignoreGravity: true,
            isStatic: true
        });

        scene.add.existing(this);

        scene.anims.create({
            key: 'antigravitypad-work',
            frames: this.anims.generateFrameNumbers('anti-gravity-pad', {
                first: 0,
                start: 0,
                end: 4
            }),
            frameRate: 12,
            repeat: -1
        });

        this.setInteractive()
            .on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
                if (pointer.rightButtonDown()) {
                    this.handleReturn();
                }
            });

        this.play('antigravitypad-work');

        this.addInfluenceZone();
    }

    /**
     * Add influence zone. Moved from ctor just for readability
     */
    protected addInfluenceZone() {
        const { scene } = this;
        this.influenceZone = scene.matter.bodies.rectangle(
            this.x,
            this.calculateNewYForInfluenceZone(this.y),
            this.width,
            AntiGravityPad.INFLUENCE_HEIGHT,
            {
                collisionFilter: {
                    category: 0,
                    mask: 0,
                    group: 0,
                },
                ignoreGravity: true,
                isSensor: true,
            }
        );

        scene.matter.world.add(this.influenceZone);

        const throttleOrder = 3;
        let throttle = 0;
        scene.matter.world.on(Phaser.Physics.Matter.Events.AFTER_UPDATE, () => {
            if (throttle = ++throttle % throttleOrder) {
                if (this.influenceZone) {
                    const bodies = scene.matter.intersectBody(this.influenceZone);

                    // @TODO: ONLY SUPPOSED BODIES
                    bodies.forEach((overlappedBody) => {
                        const casted = unsafeCastBody(overlappedBody);

                        // @TODO: how to calculate properly?
                        const yForce = casted.ignoreGravity ?
                            - AntiGravityPad.NON_GRAVITY_FORCE_MULTIPLIER
                            : -casted.gravityScale.y * AntiGravityPad.GRAVITY_FORCE_MULTIPLIER;

                        scene.matter.applyForce(overlappedBody, {
                            x: 0,
                            y: yForce
                        });
                    });
                }
            }
        });
    }

    protected handleReturn() {
        this.scene.toolsDashboard
            .get(AntiGravityPadDashboardPresenter.name)
            .returnObject(this);

        this.destroy();
    }

    /**
     * @inheritdoc
     */
    public setPosition(x?: number | undefined, y?: number | undefined, z?: number | undefined, w?: number | undefined): this {
        super.setPosition(x, y, z, w);

        if (this.influenceZone) {
            this.scene.matter.body.setPosition(this.influenceZone, {
                x: x || 0,
                y: this.calculateNewYForInfluenceZone(y || 0)
            });
        }

        return this;
    }

    /**
     * Returns Y for influence zone, calculated by influence height and pad height
     *
     * @param padY
     */
    protected calculateNewYForInfluenceZone(padY: number) {
        return padY - AntiGravityPad.INFLUENCE_HEIGHT / 2 - this.height / 2
    }

    /**
     * Dtor
     *
     * @param fromScene
     */
    public destroy(fromScene?: boolean | undefined): void {
        this.scene.matter.world.remove(this.influenceZone);
        super.destroy(fromScene);

        // @ts-ignore
        this.influenceZone = undefined;
    }
}


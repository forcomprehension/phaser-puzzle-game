import { BallDashboardPresenter } from "@GameObjects/ToolsDashboard/dashboardPresenters/BallDashboardPresenter";
import { WORLD_STATIC } from "@src/constants/collision";
import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { BallSpawnerType } from "./BallSpawner/ballSpawnerType";
import { getMatterBody } from "@src/physics/matter";

/**
 * All balls shape
 */
export abstract class AbstractBall extends Phaser.Physics.Matter.Image {
    /**
     * Ctor
     */
    constructor(
        public scene: BaseGameScene,
        x: number,
        y: number,
        texture: string,
        protected spawnerType: BallSpawnerType,
        bounce: number = 1
    ) {
        const textureObject = scene.textures.get(texture);
        const imageHeight = textureObject.getSourceImage().height;

        super(scene.matter.world, x, y, texture);
        this.setCircle(imageHeight / 2, {
            collisionFilter: {
                category: WORLD_STATIC,
            },
            friction: 0.4,
        });
        this.setScale(.5);
        this.setBounce(bounce);
        this.scene.matter.body.setInertia(getMatterBody(this), getMatterBody(this).inertia / 3);

        this.setInteractive()
            .on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
                if (pointer.rightButtonDown()) {
                    this.handleReturn();
                }
            });

        const rotationHelperHandler = () => {
            const thisBody = getMatterBody(this);
            if (thisBody) {
                if (thisBody.angularSpeed < 0.01) {
                    this.setAngularVelocity(thisBody.angularVelocity  / 2);
                    if (thisBody.angularSpeed < 0.001) {
                        this.scene.matter.body.setAngularVelocity(thisBody, 0);
                    }
                }
            }
        };
        this.scene.matter.world.on(Phaser.Physics.Matter.Events.BEFORE_UPDATE, rotationHelperHandler);
        this.on(Phaser.GameObjects.Events.DESTROY, () => {
            this.scene.matter.world.off(Phaser.Physics.Matter.Events.BEFORE_UPDATE, rotationHelperHandler);
        });

        scene.add.existing(this);
    }

    protected handleReturn() {
        this.scene.toolsDashboard
            .get(BallDashboardPresenter.name + '|' + this.spawnerType)
            .returnObject(this);

        this.destroy();
    }
}

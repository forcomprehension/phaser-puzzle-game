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
        this.scene.matter.body.setInertia(getMatterBody(this), getMatterBody(this).inertia / 2);

        this.setInteractive()
            .on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
                if (pointer.rightButtonDown()) {
                    this.handleReturn();
                }
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

import { BallDashboardPresenter } from "@GameObjects/ToolsDashboard/dashboardPresenters/BallDashboardPresenter";
import { WORLD_STATIC } from "@src/constants/collision";
import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { BallSpawnerType } from "./BallSpawner/ballSpawnerType";

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

        super(scene.matter.world, x, y, texture, undefined, {
            collisionFilter: {
                category: WORLD_STATIC,
            },
            circleRadius: imageHeight / 2
        });

        this.setBounce(bounce);

        scene.add.existing(this);

        this.setInteractive()
        .on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown()) {
                this.handleReturn();
            }
        });
    }

    protected handleReturn() {
        this.scene.toolsDashboard
            .get(BallDashboardPresenter.name + '|' + this.spawnerType)
            .returnObject(this);

        this.destroy();
    }
}

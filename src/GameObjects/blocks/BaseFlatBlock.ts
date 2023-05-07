import { FlatBlockDashboardPresenter } from "@GameObjects/ToolsDashboard/dashboardPresenters/FlatBlockDashboardPresenter";
import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { FlatBlockSpawnerType } from "./Spawners/flatBlockSpawnerType";

/**
 * Base class for all substance flat blocks
 */
export class BaseFlatBlock extends Phaser.GameObjects.TileSprite {
    /**
     * Ctor
     */
    constructor(
        public scene: BaseGameScene,
        x: number,
        y: number,
        textureKey: string,
        public readonly spawnerType: FlatBlockSpawnerType,
        width: number = 0,
    ) {
        const tex = scene.textures.get(textureKey);
        const frame = tex.get(tex.firstFrame);

        super(
            scene,
            x,
            y,
            width > 0 ? width : frame.width,
            frame.height,
            tex.key
        );

        const body = scene.matter.bodies.rectangle(this.x, this.y, this.width, this.height, {
            ignoreGravity: true,
            isStatic: true,
        });

        scene.matter.add.gameObject(this, body);
        scene.add.existing(this);

        this.setInteractive()
            .on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
                if (pointer.rightButtonDown()) {
                    this.handleReturn();
                }
            });
    }

    /**
     * Handle return this to dashboard presenter stack
     */
    protected handleReturn() {
        this.scene.toolsDashboard
            .get(FlatBlockDashboardPresenter.name + '|' + this.spawnerType)
            .returnObject(this);

        this.destroy();
    }
}


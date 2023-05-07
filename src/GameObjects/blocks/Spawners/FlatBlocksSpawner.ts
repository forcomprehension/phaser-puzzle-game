import { AbstractGameObjectSpawner } from "@GameObjects/ToolsDashboard/AbstractGameObjectSpawner";
import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { FlatBlockSpawnerType } from "./flatBlockSpawnerType";
import { flatMetalBlockFactory, flatWoodenBlockFactory } from "../flatBlockFactories";

/**
 * Flat block spawner
 */
export class FlatBlockSpawner extends AbstractGameObjectSpawner {

    /**
     * Base spawn width for blocks
     */
    public static readonly BASE_SPAWN_WIDTH = 200;

    /**
     * Ctor
     */
    constructor(
        public scene: BaseGameScene,
        public readonly spawnerType: FlatBlockSpawnerType
    ) {
        super(scene, FlatBlockSpawner.name + '|' + spawnerType);
    }

    /**
     * @inheritdoc
     */
    protected spawnItem({ x, y }: Phaser.Input.Pointer) {
        if (this.spawnerType === FlatBlockSpawnerType.Metal) {
            return flatMetalBlockFactory(this.scene, x, y, FlatBlockSpawner.BASE_SPAWN_WIDTH);
        } else {
            return flatWoodenBlockFactory(this.scene, x, y, FlatBlockSpawner.BASE_SPAWN_WIDTH);
        }
    }
}

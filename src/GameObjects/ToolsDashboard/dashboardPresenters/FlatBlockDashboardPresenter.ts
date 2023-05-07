import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractDashboardPresenter } from "./AbstractDashboardPresenter";
import { FlatBlockSpawner } from "@GameObjects/blocks/Spawners/FlatBlocksSpawner";
import { FlatBlockSpawnerType } from "@GameObjects/blocks/Spawners/flatBlockSpawnerType";

export class FlatBlockDashboardPresenter extends AbstractDashboardPresenter {
    /**
     * Get icon data by type
     */
    protected static getIconDataBySpawnerType(spawnerType: FlatBlockSpawnerType) {
        switch (spawnerType) {
            case FlatBlockSpawnerType.Metal: {
                return 'flatMetalBlock';
            }
            case FlatBlockSpawnerType.Wood: {
                return 'flatWoodBlock';
            }
        }
    }

    /**
     * Spawner type
     */
    protected spawnerType: FlatBlockSpawnerType;

    /**
     * @inheritdoc
     */
    protected stackCount: number = 10;

    /**
     * Ctor
     */
    constructor(
        scene: BaseGameScene,
        protected spawner: FlatBlockSpawner
    ) {
        super(
            scene,
            spawner,
            FlatBlockDashboardPresenter.getIconDataBySpawnerType(spawner.spawnerType)
        );

        this.spawnerType = spawner.spawnerType;

        this.setIconScale(.5);
    }

    /**
     * @inheritdoc
     */
    public getToolKey() {
        return `${super.getToolKey()}|${this.spawnerType}`;
    }
}

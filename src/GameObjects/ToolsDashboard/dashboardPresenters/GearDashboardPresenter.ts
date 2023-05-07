import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractDashboardPresenter } from "./AbstractDashboardPresenter";
import { GearsSpawner, GearsSpawnerType } from "@GameObjects/gears";

/**
 * Gears dashboard presenter
 */
export class GearDashboardPresenter extends AbstractDashboardPresenter {

    /**
     * Spawner type
     */
    protected spawnerType: GearsSpawnerType;

    /**
     * Ctor
     */
    constructor(scene: BaseGameScene, spawner: GearsSpawner) {
        super(
            scene,
            spawner,
            spawner.spawnerType === GearsSpawnerType.Gear6 ? "gear-6" : "gear-12",
        );

        this.spawnerType = spawner.spawnerType;

        if (this.spawnerType === GearsSpawnerType.Gear12) {
            this.setIconScale(.7);
        }
    }

    /**
     * @inheritdoc
     */
    public getToolKey() {
        return `${super.getToolKey()}|${this.spawnerType}`;
    }
}
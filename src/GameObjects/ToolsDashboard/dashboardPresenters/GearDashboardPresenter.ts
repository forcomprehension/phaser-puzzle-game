import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractDashboardPresenter } from "./AbstractDashboardPresenter";
import { GearsSpawner, GearsSpawnerType } from "@GameObjects/gears/GearsSpawners/GearSpawner";

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
    constructor(scene: BaseGameScene, spawner: GearsSpawner, x: number, y: number) {
        super(
            scene,
            spawner,
            spawner.spawnerType === "gear6" ? "gear-6" : "gear-12",
            x,
            y
        );

        this.spawnerType = spawner.spawnerType;

        if (this.spawnerType === 'gear12') {
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
import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractDashboardPresenter } from "./AbstractDashboardPresenter";
import { AntiGravityPadSpawner } from "@GameObjects/antigravity/AntiGravityPadSpawner";

export class AntiGravityPadDashboardPresenter extends AbstractDashboardPresenter {
    /**
     * Ctor
     */
    constructor(
        scene: BaseGameScene,
        spawner: AntiGravityPadSpawner
    ) {
        super(scene, spawner, ['anti-gravity-pad', 4]);
        this.setStackCount(3);
    }
}

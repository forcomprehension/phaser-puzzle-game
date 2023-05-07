import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractDashboardPresenter } from "./AbstractDashboardPresenter";
import { AntiGravityPadSpawner } from "@GameObjects/antigravity/AntiGravityPadSpawner";

/**
 * Dashboard presenter for anti-gravity pad
 */
export class AntiGravityPadDashboardPresenter extends AbstractDashboardPresenter {
    /**
     * @inheritdoc
     */
    protected stackCount: number = 3;

    /**
     * Ctor
     */
    constructor(
        scene: BaseGameScene,
        spawner: AntiGravityPadSpawner
    ) {
        super(scene, spawner, ['anti-gravity-pad', 4]);
    }
}

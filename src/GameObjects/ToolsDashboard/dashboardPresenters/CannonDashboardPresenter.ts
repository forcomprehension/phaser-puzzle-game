import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractDashboardPresenter } from "./AbstractDashboardPresenter";
import { CannonSpawner } from "@GameObjects/cannon/CannonSpawner";

/**
 * Dashboard presenter for cannon
 */
export class CannonDashboardPresenter extends AbstractDashboardPresenter {
    /**
     * @inheritdoc
     */
    protected stackCount: number = 2;

    /**
     * Ctor
     */
    constructor(scene: BaseGameScene, spawner: CannonSpawner) {
        super(scene, spawner, 'cannon');
    }
}


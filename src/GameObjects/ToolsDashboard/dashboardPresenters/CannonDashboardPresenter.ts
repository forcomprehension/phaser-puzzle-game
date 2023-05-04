import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractDashboardPresenter } from "./AbstractDashboardPresenter";
import { CannonSpawner } from "@GameObjects/cannon/CannonSpawner";

export class CannonDashboardPresenter extends AbstractDashboardPresenter {
    /**
     * Ctor
     */
    constructor(
        public scene: BaseGameScene,
        spawner: CannonSpawner
    ) {
        super(scene, spawner, 'cannon');

        this.setStackCount(2);
    }
}


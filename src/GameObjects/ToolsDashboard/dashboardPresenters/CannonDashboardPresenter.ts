import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractDashboardPresenter } from "./AbstractDashboardPresenter";
import { CannonSpawner } from "@GameObjects/cannon/CannonSpawner";

export class CannonDashboardPresenter extends AbstractDashboardPresenter {
    /**
     * Ctor
     *
     * @param scene
     * @param spawner
     * @param x
     * @param y
     */
    constructor(
        public scene: BaseGameScene,
        spawner: CannonSpawner,
        x: number,
        y: number,
    ) {
        super(scene, spawner, 'cannon', x, y);

        this.setStackCount(2);
    }
}


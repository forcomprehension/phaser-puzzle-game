import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractDashboardPresenter } from "./AbstractDashboardPresenter";
import { MotorSpawner } from "@GameObjects/motors/MotorSpawner";

export class MotorDashboardPresenter extends AbstractDashboardPresenter {

    /**
     * Ctor
     */
    constructor(scene: BaseGameScene, spawner: MotorSpawner, x: number, y: number) {
        super(
            scene,
            spawner,
            'motor',
            x,
            y
        );

        this.setIconScale(.7);
    }
}

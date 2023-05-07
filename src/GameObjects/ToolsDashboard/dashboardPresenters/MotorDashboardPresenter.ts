import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractDashboardPresenter } from "./AbstractDashboardPresenter";
import { MotorSpawner } from "@GameObjects/motors/MotorSpawner";

/**
 * Dashboard presenter for motor
 */
export class MotorDashboardPresenter extends AbstractDashboardPresenter {
    /**
     * @inheritdoc
     */
    protected stackCount: number = 2;

    /**
     * Ctor
     */
    constructor(scene: BaseGameScene, spawner: MotorSpawner) {
        super(scene, spawner, 'motor');

        this.setIconScale(.7);
    }
}

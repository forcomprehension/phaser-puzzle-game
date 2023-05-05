import { DrivingBeltDrawerTool } from "@GameObjects/connectors/DrivingBelt/DrivingBeltDrawerTool";
import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractDashboardPresenter } from "./AbstractDashboardPresenter";

/**
 * Activator for driving belt drawer
 */
export class DrivingBeltDashboardPresenter extends AbstractDashboardPresenter {
    /**
     * @inheritdoc
     */
    protected stackCount: number = 2;

    /**
     * Ctor
     */
    constructor(scene: BaseGameScene, spawner: DrivingBeltDrawerTool) {
        super(scene, spawner, 'drivingBeltIcon');
    }
}

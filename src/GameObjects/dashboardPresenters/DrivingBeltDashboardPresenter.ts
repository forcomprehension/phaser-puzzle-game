import { DrivingBeltDrawerTool } from "@GameObjects/connectors/DrivingBelt/DrivingBeltDrawerTool";
import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractDashboardPresenter } from "./AbstractDashboardPresenter";

/**
 * Activator for driving belt drawer
 */
export class DrivingBeltDashboardPresenter extends AbstractDashboardPresenter {

    /**
     * Driving belt stack counts
     */
    protected stackCount: number = 3;

    /**
     * Ctor
     */
    constructor(
        scene: BaseGameScene,
        boundTool: DrivingBeltDrawerTool,
        x: number,
        y: number
    ) {
        super(scene, boundTool, 'drivingBeltIcon', x, y);

        this.setScale(.5);
        this.setStackCount(3);
    }
}

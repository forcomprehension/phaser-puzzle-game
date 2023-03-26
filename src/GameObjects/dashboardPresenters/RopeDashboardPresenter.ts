import { RopeDrawerTool } from "@GameObjects/connectors/Rope/RopeDrawerTool";
import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractDashboardPresenter } from "./AbstractDashboardPresenter";

/**
 * Activator for rope drawer
 */
export class RopeDashboardPresenter extends AbstractDashboardPresenter {

    /**
     * Rope stack counts
     */
    protected stackCount: number = 3;

    /**
     * Ctor
     */
    constructor(
        scene: BaseGameScene,
        boundTool: RopeDrawerTool,
        x: number,
        y: number
    ) {
        super(scene, boundTool, 'ropeIcon', x, y);

        this.setScale(.5);
    }
}

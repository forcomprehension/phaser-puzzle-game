import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractDashboardPresenter } from "./AbstractDashboardPresenter";
import { AntiGravityPadSpawner } from "@GameObjects/antigravity/AntiGravityPadSpawner";

export class AntiGravityPadDashboardPresenter extends AbstractDashboardPresenter {
    constructor(
        scene: BaseGameScene,
        boundTool: AntiGravityPadSpawner,
        x: number,
        y: number
    ) {
        super(scene, boundTool, ['anti-gravity-pad', 4], x, y);
        this.setStackCount(3);
    }
}

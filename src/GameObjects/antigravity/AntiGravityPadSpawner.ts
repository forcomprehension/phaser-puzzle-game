import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AntiGravityPad } from "./AntiGravityPad";
import { AbstractPresenterBoundTool } from "@GameObjects/ToolsDashboard/AbstractPresenterBoundTool";

/**
 * Spawner of anti-gravity platform
 */
export class AntiGravityPadSpawner extends AbstractPresenterBoundTool {
    constructor(scene: BaseGameScene) {
        super(scene, AntiGravityPadSpawner.name);
    }

    public activateTool(): void {
        this.scene.input
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.tryToUseItem, this);

        super.activateTool();
    }

    public deactivateTool(): void {
        this.scene.input
            .off(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.tryToUseItem, this);

        super.deactivateTool();
    }

    protected onUseItem(pointer: Phaser.Input.Pointer) {
        new AntiGravityPad(this.scene, pointer.x, pointer.y);
    }
}

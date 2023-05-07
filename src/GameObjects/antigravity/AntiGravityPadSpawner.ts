import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AntiGravityPad } from "./AntiGravityPad";
import { AbstractGameObjectSpawner } from "@GameObjects/ToolsDashboard/AbstractGameObjectSpawner";

/**
 * Spawner of anti-gravity platform
 */
export class AntiGravityPadSpawner extends AbstractGameObjectSpawner {
    /**
     * Ctor
     *
     * @param scene
     */
    constructor(scene: BaseGameScene) {
        super(scene, AntiGravityPadSpawner.name);
    }

    /**
     * @inheritdoc
     */
    protected spawnItem(pointer: Phaser.Input.Pointer) {
        return new AntiGravityPad(this.scene, pointer.x, pointer.y);
    }
}

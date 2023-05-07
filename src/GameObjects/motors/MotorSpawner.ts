import { AbstractGameObjectSpawner } from "@GameObjects/ToolsDashboard/AbstractGameObjectSpawner";
import { Motor } from "./Motor";
import type { BaseGameScene } from "@src/scenes/BaseGameScene";

/**
 * Spawns {@see Motor}
 */
export class MotorSpawner extends AbstractGameObjectSpawner {
    /**
     * Ctor
     */
    constructor(
        public scene: BaseGameScene
    ) {
        super(scene, MotorSpawner.name);
    }

    protected spawnItem(pointer: Phaser.Input.Pointer) {
        return new Motor(this.scene, pointer.x, pointer.y);
    }
}

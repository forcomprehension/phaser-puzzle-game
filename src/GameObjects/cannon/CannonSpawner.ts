import { AbstractGameObjectSpawner } from "@GameObjects/ToolsDashboard/AbstractGameObjectSpawner";
import { Cannon } from "./Cannon";
import type { BaseGameScene } from "@src/scenes/BaseGameScene";

/**
 * Spawns {@see Cannon}
 */
export class CannonSpawner extends AbstractGameObjectSpawner {
    /**
     * Ctor
     */
    constructor(
        public scene: BaseGameScene
    ) {
        super(scene, CannonSpawner.name);
    }

    protected spawnItem(pointer: Phaser.Input.Pointer) {
        return new Cannon(this.scene, pointer.x, pointer.y);
    }
}

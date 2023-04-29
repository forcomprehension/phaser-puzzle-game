import { AbstractGameObjectSpawner } from "@GameObjects/ToolsDashboard/AbstractGameObjectSpawner";
import { Cannon } from "./Cannon";
import { BaseGameScene } from "@src/scenes/BaseGameScene";

export class CannonSpawner extends AbstractGameObjectSpawner {
    constructor(public scene: BaseGameScene) {
        super(scene, CannonSpawner.name);
    }

    protected spawnItem(pointer: Phaser.Input.Pointer): void {
        new Cannon(this.scene, pointer.x, pointer.y);
    }
}

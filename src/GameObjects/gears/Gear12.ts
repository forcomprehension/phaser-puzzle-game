import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractGear } from "./AbstractGear";
import { GearsSpawnerType } from "./GearsSpawners/GearSpawner";

export class Gear12 extends AbstractGear {
    public spawnerType: GearsSpawnerType = 'gear12';
    constructor(scene: BaseGameScene, x: number, y: number) {
        super(scene, x, y, 'gear-12');

        this.setPhysicsBoundsByCoefficient(this.displayHeight / 2 * .99);
    }
}

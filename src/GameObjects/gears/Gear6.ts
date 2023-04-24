import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractGear } from "./AbstractGear";
import { GearsSpawnerType } from "./GearsSpawners/GearSpawner";

export class Gear6 extends AbstractGear {
    public spawnerType: GearsSpawnerType = 'gear6';
    public readonly rotationRatio: number = 2;

    constructor(scene: BaseGameScene, x: number, y: number) {
        super(scene, x, y, 'gear-6');

        this.setPhysicsBoundsByCoefficient(this.displayHeight / 2 * 0.6);
    }
}

import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractGear } from "./AbstractGear";
import { GearsSpawnerType } from "./GearSpawner/gearSpawnerType";

export class Gear12 extends AbstractGear {
    public spawnerType: GearsSpawnerType = GearsSpawnerType.Gear12;

    /**
     * Ctor
     */
    constructor(scene: BaseGameScene, x: number, y: number) {
        super(scene, x, y, 'gear-12');

        this.setPhysicsBoundsByCoefficient(this.displayHeight / 2 * .99);
    }
}

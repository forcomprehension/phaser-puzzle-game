import { AbstractGear } from "./AbstractGear";

export class Gear12 extends AbstractGear {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'gear-12');

        this.setScale(.4);
        this.setPhysicsBoundsByCoefficient(this.displayHeight / 2 * .99);
    }
}

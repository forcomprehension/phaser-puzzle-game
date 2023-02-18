import { AbstractGear } from "./AbstractGear";

export class Gear6 extends AbstractGear {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'gear-6');

        this.setScale(.2);
        this.setPhysicsBoundsByCoefficient(this.displayHeight / 2 * 0.6);
    }
}

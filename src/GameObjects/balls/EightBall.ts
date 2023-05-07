import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractBall } from "./AbstractBall";
import { BallSpawnerType } from "./BallSpawner/ballSpawnerType";

/**
 * Eight ball
 */
export class EightBall extends AbstractBall {
    /**
     * Ctor
     */
    constructor(
        public scene: BaseGameScene,
        x: number,
        y: number
    ) {
        super(scene, x, y, 'eight-ball', BallSpawnerType.Eight, .275);

        this.setIgnoreGravity(true);
    }
}
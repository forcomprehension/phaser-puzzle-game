import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractBall } from "./AbstractBall";
import { BallSpawnerType } from "./BallSpawner/ballSpawnerType";

/**
 * Bowling ball
 */
export class BowlingBall extends AbstractBall {
    /**
     * Ctor
     */
    constructor(
        public scene: BaseGameScene,
        x: number,
        y: number
    ) {
        super(scene, x, y, 'bowling-ball', BallSpawnerType.Bowling, .275);
    }
}

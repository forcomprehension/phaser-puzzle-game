import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractBall } from "./AbstractBall";
import { BallSpawnerType } from "./BallSpawner/ballSpawnerType";

/**
 * Football ball
 */
export class FootballBall extends AbstractBall {
    /**
     * Ctor
     */
    constructor(
        public scene: BaseGameScene,
        x: number,
        y: number
    ) {
        super(scene, x, y, 'football-ball', BallSpawnerType.Football, .525);
    }
}


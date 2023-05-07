import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractBall } from "./AbstractBall";
import { BallSpawnerType } from "./BallSpawner/ballSpawnerType";

/**
 * Basketball ball
 */
export class BasketballBall extends AbstractBall {
    /**
     * Ctor
     */
    constructor(
        public scene: BaseGameScene,
        x: number,
        y: number
    ) {
        super(scene, x, y, 'basketball-ball', BallSpawnerType.Basket, .675);
    }
}

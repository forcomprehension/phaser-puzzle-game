import { AbstractGameObjectSpawner } from "@GameObjects/ToolsDashboard/AbstractGameObjectSpawner";
import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { BasketballBall } from "../BasketballBall";
import { BouncyBall } from "../BouncyBall";
import { BowlingBall } from "../BowlingBall";
import { EightBall } from "../EightBall";
import { FootballBall } from "../FootballBall";
import { BallSpawnerType } from "./ballSpawnerType";

/**
 * Ball spawner
 */
export class BallSpawner extends AbstractGameObjectSpawner {
    /**
     * Ctor
     */
    constructor(
        public scene: BaseGameScene,
        public readonly spawnerType: BallSpawnerType
    ) {
        super(scene, BallSpawner.name + '|' + spawnerType);
    }

    /**
     * @inheritdoc
     */
    protected spawnItem({ x, y }: Phaser.Input.Pointer): Phaser.GameObjects.GameObject {
        switch (this.spawnerType) {
            case BallSpawnerType.Basket: {
                return new BasketballBall(this.scene, x, y);
            }
            case BallSpawnerType.Bouncy: {
                return new BouncyBall(this.scene, x, y);
            }
            case BallSpawnerType.Bowling: {
                return new BowlingBall(this.scene, x, y);
            }
            case BallSpawnerType.Eight: {
                return new EightBall(this.scene, x, y);
            }
            case BallSpawnerType.Football: {
                return new FootballBall(this.scene, x, y);
            }
        }
    }
}

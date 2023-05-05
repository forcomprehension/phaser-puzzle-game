import { AbstractGameObjectSpawner } from "@GameObjects/ToolsDashboard/AbstractGameObjectSpawner";
import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { BasketballBall } from "../BasketballBall";
import { BouncyBall } from "../BouncyBall";
import { BowlingBall } from "../BowlingBall";
import { EightBall } from "../EightBall";
import { FootballBall } from "../FootballBall";
import { BallSpawnType } from "./ballSpawnType";

/**
 * Ball spawner
 */
export class BallSpawner extends AbstractGameObjectSpawner {
    /**
     * Ctor
     */
    constructor(
        public scene: BaseGameScene,
        public readonly spawnerType: BallSpawnType
    ) {
        super(scene, BallSpawner.name + '|' + spawnerType);
    }

    /**
     * @inheritdoc
     */
    protected spawnItem({ x, y }: Phaser.Input.Pointer): Phaser.GameObjects.GameObject {
        switch (this.spawnerType) {
            case BallSpawnType.Basket: {
                return new BasketballBall(this.scene, x, y);
            }
            case BallSpawnType.Bouncy: {
                return new BouncyBall(this.scene, x, y);
            }
            case BallSpawnType.Bowling: {
                return new BowlingBall(this.scene, x, y);
            }
            case BallSpawnType.Eight: {
                return new EightBall(this.scene, x, y);
            }
            case BallSpawnType.Football: {
                return new FootballBall(this.scene, x, y);
            }
        }
    }
}

import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractDashboardPresenter } from "./AbstractDashboardPresenter";
import { BallSpawnType, BallSpawner } from "@GameObjects/balls";

/**
 * Balls spawner
 */
export class BallDashboardPresenter extends AbstractDashboardPresenter {

    /**
     * SpawnerType
     */
    protected spawnerType: BallSpawnType;

    /**
     * Gets dashboard icon by spawner type
     */
    public static getIconBySpawnerType(type: BallSpawnType) {
        switch (type) {
            case BallSpawnType.Basket: {
                return 'basketball-ball';
            }
            case BallSpawnType.Bouncy: {
                return 'ball-124';
            }
            case BallSpawnType.Bowling: {
                return 'bowling-ball';
            }
            case BallSpawnType.Eight: {
                return 'eight-ball';
            }
            case BallSpawnType.Football: {
                return 'football-ball';
            }
        }
    }

    /**
     * Ctor
     */
    constructor(scene: BaseGameScene, spawner: BallSpawner) {
        super(
            scene,
            spawner,
            BallDashboardPresenter.getIconBySpawnerType(spawner.spawnerType)
        );
    }

    /**
     * @inheritdoc
     */
    public getToolKey() {
        return `${super.getToolKey()}|${this.spawnerType}`
    }
}

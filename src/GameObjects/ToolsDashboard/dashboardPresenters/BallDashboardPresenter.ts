import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractDashboardPresenter } from "./AbstractDashboardPresenter";
import { BallSpawner } from "@GameObjects/balls/BallSpawner/BallSpawner";
import { BallSpawnerType } from "@GameObjects/balls/BallSpawner/ballSpawnerType";

/**
 * Icon data settings for BallDashboardPresenter
 */
type IconData = [
    string,
    number
];

/**
 * Balls spawner
 */
export class BallDashboardPresenter extends AbstractDashboardPresenter {

    /**
     * @inheritdoc
     */
    protected stackCount: number = 10;

    /**
     * SpawnerType
     */
    protected spawnerType: BallSpawnerType;

    /**
     * Gets dashboard icon by spawner type
     */
    public static getIconDataBySpawnerType(type: BallSpawnerType): IconData {
        switch (type) {
            case BallSpawnerType.Basket: {
                return ['basketball-ball', .7];
            }
            case BallSpawnerType.Bouncy: {
                return ['ball-124', 1];
            }
            case BallSpawnerType.Bowling: {
                return ['bowling-ball', .7];
            }
            case BallSpawnerType.Eight: {
                return ['eight-ball', 1];
            }
            case BallSpawnerType.Football: {
                return ['football-ball', .8];
            }
        }
    }

    /**
     * Ctor
     */
    constructor(scene: BaseGameScene, spawner: BallSpawner) {
        const [
            textureKey,
            iconScale
        ] = BallDashboardPresenter.getIconDataBySpawnerType(spawner.spawnerType);

        super(
            scene,
            spawner,
            textureKey
        );

        this.spawnerType = spawner.spawnerType;
        this.setIconScale(iconScale);
    }

    /**
     * @inheritdoc
     */
    public getToolKey() {
        return `${super.getToolKey()}|${this.spawnerType}`
    }
}

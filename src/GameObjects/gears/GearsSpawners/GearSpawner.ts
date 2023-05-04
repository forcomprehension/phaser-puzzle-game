import { AbstractGameObjectSpawner } from "@GameObjects/ToolsDashboard/AbstractGameObjectSpawner";
import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractGear } from "../AbstractGear";
import { Gear6 } from "../Gear6";
import { Gear12 } from "../Gear12";

export type GearsSpawnerType = 'gear6' | 'gear12';

/**
 * Spawn gear depends on type
 */
export class GearsSpawner extends AbstractGameObjectSpawner {
    /**
     * @param scene
     * @param spawnerType
     */
    constructor(
        scene: BaseGameScene,
        public readonly spawnerType: GearsSpawnerType
    ) {
        super(scene, GearsSpawner.name + '|' + spawnerType);
    }

    /**
     * @inheritdoc
     */
    public onReturnItem(gameObject: Phaser.GameObjects.GameObject): void {
        super.onReturnItem(gameObject);

        if (gameObject instanceof AbstractGear) {
            this.scene.gearsManager.unregisterGear(gameObject);
        } else {
            console.error('Catch an unexpected object when trying return a Gear');
        }
    }

    /**
     * Spawn gear
     *
     * @param pointer
     */
    protected spawnItem(pointer: Phaser.Input.Pointer) {
        let gear: AbstractGear;
        if (this.spawnerType === 'gear6') {
            gear = new Gear6(this.scene, pointer.x, pointer.y);
        } else {
            gear = new Gear12(this.scene, pointer.x, pointer.y);
        }

        this.scene.gearsManager.registerGear(gear);

        return gear;
    }
}

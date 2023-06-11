import { INACTIVE_PIN_COLOR } from "@src/constants/colors";
import type { BaseGameScene } from "@src/scenes/BaseGameScene";

/**
 * Node Pin for commands
 */
export class NodePin extends Phaser.GameObjects.Container {

    protected static readonly RADIUS = 20;

    public static readonly HEIGHT = this.RADIUS * 2;

    protected zone: Optional<Phaser.GameObjects.Zone>;
    protected circle: Optional<Phaser.GameObjects.Arc>;

    /**
     * Ctor
     */
    constructor(scene: BaseGameScene) {
        super(scene, 0, 0);

        this.circle = this.scene.add.circle(0, 0, NodePin.RADIUS, INACTIVE_PIN_COLOR)
        this.zone = this.scene.add.zone(0, 0, NodePin.HEIGHT, NodePin.HEIGHT);

        this.add([this.circle, this.zone]);

        this.scene.add.existing(this);
    }

    public destroy(fromScene?: boolean | undefined): void {
        this.circle = this.zone = undefined;

        super.destroy(fromScene);
    }
}

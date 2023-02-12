
export abstract class AbstractGear extends Phaser.Physics.Matter.Image {

    /**
     * Does gear driven by a motor?
     */
    protected isDriven: boolean = false;

    /**
     * @inheritdoc
     */
    constructor(world: Phaser.Physics.Matter.World, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | number, options?: Phaser.Types.Physics.Matter.MatterBodyConfig) {
        super(world, x, y, texture, frame, options);
        // world.scene.add.existing(this);
    }

    /**
     * Setter for isDriven
     */
    public setIsDriven(isDriven: boolean) {
        this.isDriven = isDriven;
    }

    /**
     * Does gear driven by a motor?
     */
    public getIsDriven() {
        return this.isDriven;
    }
}

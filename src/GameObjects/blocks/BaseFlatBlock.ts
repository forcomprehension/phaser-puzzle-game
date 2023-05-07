import type { BaseGameScene } from "@src/scenes/BaseGameScene";

/**
 * Base class for all substance flat blocks
 */
export class BaseFlatBlock extends Phaser.GameObjects.TileSprite {
    /**
     * Ctor
     */
    constructor(
        public scene: BaseGameScene,
        x: number,
        y: number,
        textureKey: string,
        width: number = 0,
    ) {
        const tex = scene.textures.get(textureKey);
        const frame = tex.get(tex.firstFrame);

        super(
            scene,
            x,
            y,
            width > 0 ? width : frame.width,
            frame.height,
            tex.key
        );

        const body = scene.matter.bodies.rectangle(this.x, this.y, this.width, this.height, {
            ignoreGravity: true,
            isStatic: true,
        });

        scene.matter.add.gameObject(this, body);
        scene.add.existing(this);
    }
}


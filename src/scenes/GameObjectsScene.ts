import { Gear12 } from "@GameObjects/gears";
import { Gear6 } from "@GameObjects/gears";
import { BaseGameScene } from "./BaseGameScene";
import { setDraggable } from "@utils/gameObjects/setDraggable";
import { Tom } from "@GameObjects/characters/Tom/Tom";

/**
 * Game objects tests scene
 */
export class GameObjectsScene extends BaseGameScene {

    constructor() {
        super("GameObjects.test");
    }

    public create() {
        super.create();
        this.bootstrap();

        const gear12 = new Gear12(this, 499, 100);
        const gear6 = new Gear6(this, 500, 190);
        const gear6_2 = new Gear6(this, 650, 190);

        setDraggable(this, gear12, gear6, gear6_2);
        gear6_2.tint = 0xFF0000;

        const tom = new Tom(this, -200, 800);
        tom.setPipeline(Phaser.Renderer.WebGL.Pipelines.LIGHT_PIPELINE);
    }

    protected bootstrap() {
        const { canvasHeight, canvasWidth } = this.getCanvasSize();
        const bgImage = this.add.image(0, 0, 'bg')
            .setDepth(-1)
            .setOrigin(0)
            .setPipeline(Phaser.Renderer.WebGL.Pipelines.LIGHT_PIPELINE);

        this.lights.enable()
            .addLight(1100, 30, 2000, undefined, 1);

        this.lights.setAmbientColor(0xFFFFFF);

        const scale = Math.max(
            canvasWidth / bgImage.displayWidth,
            canvasHeight / bgImage.displayHeight
        );

        bgImage.setScale(scale);
    }
}

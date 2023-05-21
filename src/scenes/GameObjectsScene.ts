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

    public preload() {
        this.load.image('electrical-panel', 'assets/levels/test-level/electricalpanel.jpg');
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
        setTimeout(async () => {
            await tom.walk(200);
            const { light } = this.lights.getLights(this.cameras.default)[0] as any;
            light.setIntensity(0.0001);
            this.lights.setAmbientColor(0x666666);
            const newLight = this.lights.addLight(tom.x, tom.y - 50)
                .setIntensity(.7)
                .setRadius(400)

            setTimeout(() => {
                const { canvasWidth, canvasHeight } = this.getCanvasSize();
                const electricalPanel = this.add.image(canvasWidth / 2, canvasHeight / 2, 'electrical-panel');
                setTimeout(() => {
                    electricalPanel.destroy();
                    this.lights.removeLight(newLight);
                    this.lights.setAmbientColor(0xAAAAAA);
                    light.setIntensity(2);
                    tom.walk(1900);
                }, 2000);
            }, 1500);
        }, 1000);
    }

    protected bootstrap() {
        const bgImage = this.add.image(-250, 0, 'bg')
            .setDepth(-1)
            .setOrigin(0)
            .setPipeline(Phaser.Renderer.WebGL.Pipelines.LIGHT_PIPELINE);

        this.lights.enable()
            .addLight(1920 - 250 - 50, 400, 2000, undefined, 2);

        this.lights.setAmbientColor(0xAAAAAA);

        const scale = Math.max(
            this.sys.canvas.width / bgImage.displayWidth,
            this.sys.canvas.height / bgImage.displayHeight
        );

        bgImage.setScale(scale);
    }
}

import { Gear12 } from "@GameObjects/gears";
import { Gear6 } from "@GameObjects/gears";
import { BaseGameScene } from "./BaseGameScene";
import { setDraggable } from "@utils/gameObjects/setDraggable";
import { flatMetalBlockFactory, flatWoodenBlockFactory } from "@GameObjects/blocks/flatBlockFactories";
import { BasketballBall } from "@GameObjects/balls";

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
        const metalBlock = flatMetalBlockFactory(this, 200, 500, 750).setAngle(30);
        const woodBlock = flatWoodenBlockFactory(this, 1130, 925, 950);
        new BasketballBall(this, 270, 220);

        this.gearsManager.bulkUpdate(() => {
            this.gearsManager.registerGear(gear12)
                .registerGear(gear6)
                .registerGear(gear6_2);

            /**
             * @TODO: In game we must check gears and autoconnect them.
             */
            // this.gearsManager.toggleMotor(gear6, ROTATION_DIRECTION.CCW)
            //     .connectGears(gear12, gear6);
            // Make subgraph jammed
            // this.gearsManager.toggleMotor(gear12, ROTATION_DIRECTION.CCW);
        });

        setDraggable(this, gear12, gear6, gear6_2, woodBlock, metalBlock);
        gear6_2.tint = 0xFF0000;

    }

    protected bootstrap() {
        const bgImage = this.add.image(0, 0, 'bg')
            .setDepth(-1)
            .setOrigin(0);

        const scale = Math.max(
            this.sys.canvas.width / bgImage.displayWidth,
            this.sys.canvas.height / bgImage.displayHeight
        );

        bgImage.setScale(scale);
    }
}

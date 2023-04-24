import { Gear12 } from "@GameObjects/gears/Gear12";
import { Gear6 } from "@GameObjects/gears/Gear6";
import { Motor } from "@GameObjects/motors/Motor";
import { BaseGameScene } from "./BaseGameScene";
import { createEightBall } from "@GameObjects/balls";
import { setDraggable } from "@utils/gameObjects/setDraggable";

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

        const motor = new Motor(this, 300, 400);

        const gear12 = new Gear12(this, 99, 100);
        const gear6 = new Gear6(this, 100, 190);
        const gear6_2 = new Gear6(this, 250, 190);

        createEightBall(this, 1350, 650);

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

        setDraggable(this, gear12, gear6, gear6_2, motor);
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

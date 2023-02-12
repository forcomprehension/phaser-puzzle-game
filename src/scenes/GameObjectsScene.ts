import { createBasketballBall, createBouncyBall, createBowlingBall, createEightBall, createFootballBall } from "@GameObjects/balls";
import { castBody } from "src/physics/matter";
import { testLevelBalls } from "../debug/levels";

function setDraggable(...objects: Phaser.GameObjects.GameObject[]) {
    objects.forEach((object) => {
        object.setInteractive({
            draggable: true,
            useHandCursor: true
        });
        object.on(Phaser.Input.Events.GAMEOBJECT_DRAG, function(_: any, x: number, y: number) {
            // @ts-ignore
            this.setPosition(x, y);
        });
    });
}

function CheckTween(this:MatterJS.BodyType, event: Phaser.Types.Physics.Matter.MatterCollisionData) {
    const scene = this.gameObject.scene;
    const iAmTweening = scene.tweens.isTweening(this.gameObject);
    const otherTweening = scene.tweens.isTweening(event.bodyA.gameObject);// @TODO: bodyA?  parent?

    if (otherTweening && !iAmTweening) {
        scene.tweens.add({
            duration: 4000,
            loop: -1,
            targets: [this.gameObject],
            rotation: Phaser.Math.DegToRad(-360),
        });
    }
}

/**
 * Game objects tests scene
 */
export class GameObjectsScene extends Phaser.Scene {
    constructor() {
        super("GameObjects.test");
    }

    public create() {
        const gear12 = this.matter.add.image(99, 100, 'gear-12');
        gear12.setScale(.4);
        gear12.setCircle(gear12.displayHeight / 2 * .99);
        gear12.setIgnoreGravity(true);

        const gear6 = this.matter.add.image(100, 190, 'gear-6');
        gear6.setScale(.2);
        gear6.setCircle(gear6.displayHeight / 2 * 0.6);
        gear6.setIgnoreGravity(true);

        const gear6_2 = this.matter.add.image(250, 190, 'gear-6');
        gear6_2.setScale(.2);
        gear6_2.setCircle(gear6.displayHeight / 2 * 0.6);
        gear6_2.setIgnoreGravity(true);

        this.tweens.add({
            duration: 4000,
            loop: -1,
            targets: [gear12],
            rotation: Phaser.Math.DegToRad(360),
        });

        gear6.setOnCollide(CheckTween);
        gear6_2.setOnCollide(CheckTween);

        // gear6.setOnCollideEnd(function(this:MatterJS.BodyType, event: Phaser.Types.Physics.Matter.MatterCollisionData) {
        //     console.log('collideend');
        //     // const iAmTweening = scene.tweens.isTweening(gear6);
        //     scene.tweens.killTweensOf(gear6);
        // });

        setDraggable(gear12, gear6, gear6_2);
    }
}

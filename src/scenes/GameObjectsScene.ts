import { Gear12 } from "@GameObjects/gears/Gear12";
import { Gear6 } from "@GameObjects/gears/Gear6";
import { GearsManager } from "src/classes/GearsManager";

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
    protected readonly gearsManager = new GearsManager();
    constructor() {
        super("GameObjects.test");
    }

    public create() {
        const gear12 = new Gear12(this, 99, 100);

        const gear6 = new Gear6(this, 100, 190);
        const gear6_2 = new Gear6(this, 250, 190);

        this.gearsManager.registerGear(gear12);
        this.gearsManager.registerGear(gear6);
        this.gearsManager.registerGear(gear6_2);

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

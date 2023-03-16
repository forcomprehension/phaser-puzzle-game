import { Gear12 } from "@GameObjects/gears/Gear12";
import { Gear6 } from "@GameObjects/gears/Gear6";
import { ROTATION_DIRECTION } from "@utils/types";
import { GearsManager } from "@GameObjects/gears/GearsManager";
import { castBody } from "../physics/matter";
import { AbstractGear } from "@GameObjects/gears/AbstractGear";

function setDraggable(...objects: Phaser.Physics.Matter.Image[]) {
    objects.forEach((object) => {
        object.setInteractive({
            draggable: true,
            useHandCursor: true
        });

        let nonIntersectedPosition: Vector2Like = { x: 0, y:0 };
        object.on(Phaser.Input.Events.DRAG_START, () => {
            nonIntersectedPosition.x = object.body.position.x;
            nonIntersectedPosition.y = object.body.position.y;

            object.setStatic(false);
        });

        object.on(Phaser.Input.Events.GAMEOBJECT_DRAG, function(_: any, x: number, y: number) {
            object.setPosition(x, y);

            const bodies = object.scene.matter.intersectBody(castBody(object));
            if (bodies.length === 0) {
                nonIntersectedPosition.x = object.body.position.x;
                nonIntersectedPosition.y = object.body.position.y;
            }
        });

        object.on(Phaser.Input.Events.DRAG_END, () => {
            const myBody = castBody(object);
            object.setPosition(nonIntersectedPosition.x, nonIntersectedPosition.y);
            object.setStatic(true);

            // @TODO: move away. Subs after physic engine update?
            if (object instanceof AbstractGear) {
                object.scene.matter.body.scale(myBody, 1.1, 1.1);
                const overlaps = object.scene.matter.intersectBody(myBody);
                object.scene.matter.body.scale(myBody, 0.9, 0.9);

                const countGears = overlaps.reduce((acc, overlap) => {
                    // @ts-ignore
                    if (overlap.gameObject instanceof AbstractGear) {
                        acc++;
                    }

                    return acc;
                }, 0);

                const scene = object.scene;
                if (scene instanceof GameObjectsScene) {
                    scene.gearsManager.bulkUpdate(() => {
                        // @todo zero condition first
                        if (countGears > 0 && countGears === overlaps.length) {
                            overlaps.forEach((overlap) => {
                                // @ts-ignore
                                const hasConnection = (scene as GameObjectsScene).gearsManager.hasConnection(overlap.gameObject, object);
                                if (!hasConnection) {
                                    // @ts-ignore
                                    scene.gearsManager.connectGears(overlap.gameObject, object);
                                }
                            });
                        } else if (countGears === 0) {
                            scene.gearsManager.disconnectGear(object);
                        } else { // countGears !== overlaps. May be blocked?
                            // @TODO: SEND EXTERNAL_JAMMED?
                        }
                    });
                }
            }
        });
    });
}

/**
 * Game objects tests scene
 */
export class GameObjectsScene extends Phaser.Scene {
    public gearsManager: GearsManager;

    constructor() {
        super("GameObjects.test");
    }

    public create() {
        this.gearsManager = new GearsManager(this);

        const gear12 = new Gear12(this, 99, 100);
        const gear6 = new Gear6(this, 100, 190);
        const gear6_2 = new Gear6(this, 250, 190);

        this.gearsManager.bulkUpdate(() => {
            this.gearsManager.registerGear(gear12)
                .registerGear(gear6)
                .registerGear(gear6_2);

            this.gearsManager.toggleMotor(gear6, ROTATION_DIRECTION.CCW)
                .connectGears(gear12, gear6);
        });

        setDraggable(gear12, gear6, gear6_2);

        this.tweens.add({
            targets: [this.gearsManager],
            duration: 3000,
            rotation: Phaser.Math.DegToRad(360),
            loop: -1,
            onUpdate: () => {
                this.gearsManager.updateRotations();
            }
        });
    }
}

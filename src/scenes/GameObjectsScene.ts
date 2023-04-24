import { Gear12 } from "@GameObjects/gears/Gear12";
import { Gear6 } from "@GameObjects/gears/Gear6";
import { getMatterBody, unsafeCastBody } from "../physics/matter";
import { AbstractGear } from "@GameObjects/gears/AbstractGear";
import { Motor } from "@GameObjects/motors/Motor";
import { BaseGameScene } from "./BaseGameScene";
import { createEightBall } from "@GameObjects/balls";

function setDraggable(scene: BaseGameScene, ...objects: Phaser.Physics.Matter.Image[]) {
    objects.forEach((object) => {
        object.setInteractive({
            draggable: true,
            useHandCursor: true
        });

        let nonIntersectedPosition: Vector2Like = { x: 0, y: 0 };
        object.on(Phaser.Input.Events.DRAG_START, () => {
            if (scene.hasActiveGameObject()) {
                return;
            }

            nonIntersectedPosition.x = object.body.position.x;
            nonIntersectedPosition.y = object.body.position.y;

            object.setStatic(false);
        });

        object.on(Phaser.Input.Events.GAMEOBJECT_DRAG, function(_: any, x: number, y: number) {
            if (scene.hasActiveGameObject()) {
                return;
            }

            object.setPosition(x, y);
            const thisBody = getMatterBody(object);
            const bodies = scene.matter.intersectBody(getMatterBody(object))
                .filter((collidedBody) => {
                    if ('collisionFilter' in collidedBody) {
                        const castedBody = unsafeCastBody(collidedBody);
                        return scene.matter.detector.canCollide(castedBody.collisionFilter, thisBody.collisionFilter);
                    }

                    return false;
                });

            if (bodies.length === 0) {
                nonIntersectedPosition.x = object.body.position.x;
                nonIntersectedPosition.y = object.body.position.y;
            }
        });

        object.on(Phaser.Input.Events.DRAG_END, () => {
            if (scene.hasActiveGameObject()) {
                return;
            }

            const myBody = getMatterBody(object);
            if (object instanceof AbstractGear) {
                object.setPosition(nonIntersectedPosition.x, nonIntersectedPosition.y);
            }

            object.setStatic(true);

            // @TODO: move away. Subs after physic engine update?
            if (object instanceof AbstractGear) {
                // @TODO: TODO: how to scale?
                scene.matter.body.scale(myBody, 1.25, 1.25);
                const overlaps = scene.matter.intersectBody(myBody);
                scene.matter.body.scale(myBody, 0.8, 0.8);

                const countGears = overlaps.reduce((acc, overlap) => {
                    // @ts-ignore
                    if (overlap.gameObject instanceof AbstractGear) {
                        acc++;
                    }

                    return acc;
                }, 0);

                if (scene instanceof GameObjectsScene) {
                    scene.gearsManager.bulkUpdate(() => {
                        if (countGears === 0) {
                            scene.gearsManager.disconnectGearFromInternals(object);
                        } else if (countGears === overlaps.length) {
                            scene.gearsManager.disconnectGearFromInternals(object);
                            overlaps.forEach((overlap) => {
                                // @ts-ignore
                                scene.gearsManager.connectGears(overlap.gameObject, object);
                            });
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

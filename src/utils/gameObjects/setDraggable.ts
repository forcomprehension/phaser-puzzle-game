import { AbstractGear } from "@GameObjects/gears/AbstractGear";
import { getMatterBody, unsafeCastBody } from "@src/physics/matter";
import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { GameObjectsScene } from "@src/scenes/GameObjectsScene";

/**
 * Union of supported draggable objects
 */
type SupportedObjectsUnion = Phaser.Physics.Matter.Image |
    Phaser.Physics.Matter.Sprite;

/**
 * Enable draggable
 *
 * @param scene
 * @param objects
 */
export function setDraggable(
    scene: BaseGameScene,
    ...objects: SupportedObjectsUnion[]
) {
    objects.forEach((object) => {
        if (object.input?.enabled) {
            scene.input.setDraggable(object);
            scene.input.setHitArea(object, {
                draggable: true,
                useHandCursor: true
            })
        } else {
            object.setInteractive({
                draggable: true,
                useHandCursor: true
            });
        }

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
            const bodies = scene.matter.intersectBody(thisBody)
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

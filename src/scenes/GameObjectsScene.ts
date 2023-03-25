import { Gear12 } from "@GameObjects/gears/Gear12";
import { Gear6 } from "@GameObjects/gears/Gear6";
import { ROTATION_DIRECTION } from "@utils/types";
import { GearsManager, addGearsManagerTweens } from "@GameObjects/gears/GearsManager";
import { castBody } from "../physics/matter";
import { AbstractGear } from "@GameObjects/gears/AbstractGear";
import { Motor } from "@GameObjects/motors/Motor";
import { RopeDrawerTool } from "@GameObjects/connectors/RopeDrawerTool";

function setDraggable(...objects: Phaser.Physics.Matter.Image[]) {
    objects.forEach((object) => {
        object.setInteractive({
            draggable: true,
            useHandCursor: true
        });

        let nonIntersectedPosition: Vector2Like = { x: 0, y: 0 };
        object.on(Phaser.Input.Events.DRAG_START, () => {
            // @ts-ignore
            if (object.scene.ropeState.flag) {
               return;
            }

            nonIntersectedPosition.x = object.body.position.x;
            nonIntersectedPosition.y = object.body.position.y;

            object.setStatic(false);

            if (object instanceof Motor) {
                object.toggleRotationLock(true);
            }
        });

        object.on(Phaser.Input.Events.GAMEOBJECT_DRAG, function(_: any, x: number, y: number) {
            // @ts-ignore
            if (object.scene.ropeState.flag) {
                return;
             }
            object.setPosition(x, y);

            const bodies = object.scene.matter.intersectBody(castBody(object));
            if (bodies.length === 0) {
                nonIntersectedPosition.x = object.body.position.x;
                nonIntersectedPosition.y = object.body.position.y;
            }
        });

        object.on(Phaser.Input.Events.DRAG_END, () => {
            // @ts-ignore
            if (object.scene.ropeState.flag) {
                return;
             }

            const myBody = castBody(object);
            if (object instanceof AbstractGear) {
                object.setPosition(nonIntersectedPosition.x, nonIntersectedPosition.y);
            }

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
                        if (countGears === 0) {
                            // @TODO: Check active connections?
                            scene.gearsManager.disconnectGear(object);
                        } else if (countGears === overlaps.length) {
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

            if (object instanceof Motor) {
                object.toggleRotationLock(false);
            }
        });
    });
}

/**
 * Game objects tests scene
 */
export class GameObjectsScene extends Phaser.Scene {
    public gearsManager: GearsManager;

    public rope: Phaser.GameObjects.Graphics;

    constructor() {
        super("GameObjects.test");
    }

    public create() {
        this.bootstrap();

        const motor = new Motor(this, 300, 400);

        const gear12 = new Gear12(this, 99, 100);
        const gear6 = new Gear6(this, 100, 190);
        const gear6_2 = new Gear6(this, 250, 190);

        this.gearsManager.bulkUpdate(() => {
            this.gearsManager.registerGear(gear12)
                .registerGear(gear6)
                .registerGear(gear6_2);

            /**
             * @TODO: In game we must check gears and autoconnect them.
             */
            this.gearsManager.toggleMotor(gear6, ROTATION_DIRECTION.CCW)
                .connectGears(gear12, gear6);

            // Make subgraph jammed
            this.gearsManager.toggleMotor(gear12, ROTATION_DIRECTION.CCW);
        });

        setDraggable(gear12, gear6, gear6_2, motor);
        gear6_2.tint = 0xFF0000;

        this.createRope(this);
    }

    protected createRope(scene: Phaser.Scene) {
        // const POINTS_AT_TOP_EXCLUDE_CENTER_AT_ONE_SIDE = 10;
        // const downPoint = { y: 740, x: 960 };
        // const upPoint = { y: 340, x: 960 };
        // const STEP_VERTICAL = 5;

        // const debug = scene.add.graphics().fillStyle(0xffffff);
        // const hsl = Phaser.Display.Color.HSVColorWheel();
        // let colorIndex = 0;

        // const colors: any[] = [];
        // const points: Vector2Like[] = [
        //     upPoint
        // ];

        // colors.push(upPoint)
        // const prev = new Phaser.Math.Vector2();

        // function pushcolor({x,y}: {x: number, y: number}) {
        //     if (Phaser.Math.Distance.Between(x, y, prev.x, prev.y) > 5)
        //         {
        //             prev.x = x;
        //             prev.y = y;
    
        //             points.push(new Phaser.Math.Vector2(x, y));
        //             colors.push(hsl[colorIndex]);
    
        //             debug.fillStyle((hsl[colorIndex].r << 24) + (hsl[colorIndex].g  << 16) + (hsl[colorIndex].a << 8) + hsl[colorIndex].a);
        //             debug.fillRect(x, y, 2, 2);

        //             colorIndex = Phaser.Math.Wrap(colorIndex + 2, 0, 359);
        //         }
        // }

        // // top right
        // for (let t = 1; t != POINTS_AT_TOP_EXCLUDE_CENTER_AT_ONE_SIDE; t++) {
        //     const nextPoint = {
        //         y: upPoint.y + STEP_VERTICAL * t,
        //         x: upPoint.x + STEP_VERTICAL * t
        //     };

        //     points.push(nextPoint);
        //     colors.push(nextPoint);
        // }

        // // bottom right
        // for (let t = POINTS_AT_TOP_EXCLUDE_CENTER_AT_ONE_SIDE - 1; t; t--) {
        //     const nextPoint = {
        //         y: downPoint.y - STEP_VERTICAL * t,
        //         x: downPoint.x + STEP_VERTICAL * t
        //     };

        //     points.push(nextPoint);
        //     colors.push(nextPoint);
        // }

        // points.push(downPoint);

        // // bottom left
        // for (let t = POINTS_AT_TOP_EXCLUDE_CENTER_AT_ONE_SIDE - 1; t; t--) {
        //     const nextPoint = {
        //         y: downPoint.y - STEP_VERTICAL * t,
        //         x: downPoint.x - STEP_VERTICAL * t
        //     };

        //     points.push(nextPoint);
        //     colors.push(nextPoint);
        // }

        // // top left
        // for (let t = 1; t != POINTS_AT_TOP_EXCLUDE_CENTER_AT_ONE_SIDE; t++) {
        //     const nextPoint = {
        //         y: upPoint.y - STEP_VERTICAL * t,
        //         x: upPoint.x - STEP_VERTICAL * t
        //     };

        //     points.push(nextPoint);
        //     colors.push(nextPoint);
        // }

        // points.push(upPoint);
        // colors.push(upPoint);

        // const rope = scene.add.rope(0, 0, '6x6', undefined, points, true);

       const ropeLine = this.rope = scene.add.graphics();
       ropeLine.setDefaultStyles({
        lineStyle: {
            width: 10,
            color: 0xff0000,
            alpha: 1
        }
       });
       // @ts-ignore
    //    let active = this.active = { flag: false };
    //    const start = { x: 0, y: 0 };
    //    const current = { x: 0, y: 0 };
       // @ts-ignore
       const ropeState = this.ropeState = { flag: false };

       // @ts-ignore
    //    this.start = start; this.current = current;

    //    scene.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: any) => {
    //         start.x = pointer.x;
    //         start.y = pointer.y;
    //         active.flag = true;
    //    });

    //    scene.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer: any) => {
    //         current.x = pointer.x;
    //         current.y = pointer.y;
    //    });

    //    scene.input.on(Phaser.Input.Events.POINTER_UP, (pointer: any) => {
    //         active.flag = false;
    //    });
    //    scene.input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, (pointer: any) => {
    //         active.flag = false;
    //     });

        const ropeDrawer = new RopeDrawerTool(this);
        scene.add.existing(ropeDrawer);

        const ropeStateIcon = scene.add.image(1700, 200, 'ropeIcon').setInteractive({
            useHandCursor: true
        }).on(Phaser.Input.Events.POINTER_UP, () => {
            ropeState.flag = !ropeState.flag;
            if (ropeState.flag) {
                ropeDrawer.activateTool();
                ropeStateIcon.tint = 0xFF3333;
            } else {
                ropeDrawer.deactivateTool();
                ropeStateIcon.clearTint();
            }
        }).setScale(.5);
    }

    // update(time: number, delta: number): void {
    //     this.rope.clear();
    //     // @ts-ignores
    //     if (this.active.flag && this.ropeState.flag) {
    //         // @ts-ignore
    //         // this.rope.lineStyle(10, 0xff0000, 1);
    //         // @ts-ignore
    //         this.rope.lineBetween(this.start.x, this.start.y, this.current.x, this.current.y);
    //     }
    // }

    protected bootstrap() {
        this.gearsManager = new GearsManager(this);
        addGearsManagerTweens(this, this.gearsManager);
    }
}

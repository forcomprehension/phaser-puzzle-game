import { createBasketballBall, createBouncyBall, createBowlingBall, createEightBall, createFootballBall } from "@GameObjects/balls";
import { GameObjectsScene } from "src/scenes/GameObjectsScene";

export function testLevelBalls(this: GameObjectsScene) {
    // Set all bounds, except top
    this.matter.world.setBounds(0, 0, undefined, undefined, undefined, true, true, false, true);

    const bouncyBall = createBouncyBall(this, 100, 100);
    const basketBallBall = createBasketballBall(this, 300, 300);
    createBowlingBall(this, 500, 300);
    createFootballBall(this, 700, 300);
    setTimeout(() => {
        const eightBall = createEightBall(this, 100, 300);
        //this.physics.add.collider(eightBall, bouncyBall);
    }, 1000);

    //this.matter.add.collider(bouncyBall, basketBallBall);
}

export function testLevelGears(this: GameObjectsScene) {

}

export function testRope(this: GameObjectsScene) {
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
}


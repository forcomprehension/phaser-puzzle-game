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



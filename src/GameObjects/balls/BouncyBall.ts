import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { AbstractBall } from "./AbstractBall";

/**
 * Ball with high bounciness
 */
export class BouncyBall extends AbstractBall {
    /**
     * Ctor
     */
    constructor(
        public scene: BaseGameScene,
        x: number,
        y: number
    ) {
        super(scene, x, y, 'ball-124');

        const { canvasHeight, canvasWidth } = scene.getCanvasSize();

        const maxVelocity = new Phaser.Math.Vector2(canvasWidth / 2, canvasHeight / 2);
        const maxMagnitude = maxVelocity.setAngle(0)
            .multiply({ x: 0.03, y: 0.03 }) // @TODO: magic numbers
            .length();

        //     scene.events.on(Phaser.Scenes.Events.UPDATE, function UpdateBouncyBall(_: number, deltaTime: number) {
        //         const body = castBody(ball);
        //         const velocityVec = new Phaser.Math.Vector2(body.velocity);
        //         const currentLength = velocityVec.length();
        //         const interpolated = Phaser.Math.Linear(currentLength, maxMagnitude, .005);
        // console.log(interpolated);
        //         velocityVec.setLength(interpolated);
        //         // ball.setVelocity(velocityVec.x, velocityVec.y);
        //     });
            // castBody(ball).gravityScale ={ x: 5, y: 5 };

        // This ball must jumps out of screen
        this.setOnCollide(() => {
            const currentVelocity = new Phaser.Math.Vector2(this.body.velocity);
            const dist = maxMagnitude - currentVelocity.length();
            if (dist < 1) {
                return;
            }

            currentVelocity.setLength(maxMagnitude);

            this.setVelocity(currentVelocity.x * -1, currentVelocity.y * -1);
        });
    }
}

import { getMatterBody, setWorldCollision } from "../../physics/matter";

/**
 * Create ball base
 *
 * @param scene
 * @param x
 * @param y
 * @param key
 * @param scale
 */
function createBall(
    scene: Phaser.Scene, x: number, y: number, key: string, scale: number, bounce: number) {
    const ball = scene.matter.add.image(x, y, key);

    ball.setScale(scale);
    ball.setCircle(ball.displayHeight / 2);
    ball.setBounce(bounce);
    setWorldCollision(scene, [ball]);

    return ball;
}

/**
 * Create and add to scene a bouncy ball
 *
 * @param scene
 * @param x
 * @param y
 *
 * @returns
 */
export function createBouncyBall(scene: Phaser.Scene, x: number, y: number) {
    // @todo: must be const
    const { height, width } = scene.sys.game.canvas;
    // @TODO: const, mass, atmosphere
    const maxVelocity = new Phaser.Math.Vector2(width / 2, height / 2);
    const maxMagnitude = maxVelocity.setAngle(0)
        .multiply({ x: 0.03, y: 0.03 }) // @TODO: magic numbers
        .length();

    const ball = createBall(scene, x, y, 'ball-124', .5, 1);
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
    ball.setOnCollide(function BouncyBallCollideListener(this: MatterJS.BodyType) {
        const currentVelocity = new Phaser.Math.Vector2(ball.body.velocity);
        const dist = maxMagnitude - currentVelocity.length();
        if (dist < 1) {
            return;
        }

        currentVelocity.setLength(maxMagnitude);
        // currentVelocity.rotate(Math.random() * 360)

        ball.setVelocity(currentVelocity.x * -1, currentVelocity.y * -1);
    });

    return ball;
}

/**
 * Create and add to scene a basketball ball
 *
 * @param scene
 * @param x
 * @param y
 *
 * @returns
 */
export function createBasketballBall(scene: Phaser.Scene, x: number, y: number) {
    return createBall(scene, x, y, 'basketball-ball', .6, .675);
}

/**
 * Create and add to scene a football ball
 *
 * @param scene
 * @param x
 * @param y
 *
 * @returns
 */
export function createFootballBall(scene: Phaser.Scene, x: number, y: number) {
    return createBall(scene, x, y, 'football-ball', .5, .525);
}

/**
 * Create and add to scene a football ball
 *
 * @param scene
 * @param x
 * @param y
 *
 * @returns
 */
export function createBowlingBall(scene: Phaser.Scene, x: number, y: number) {
    return createBall(scene, x, y, 'bowling-ball', .5, .275);
}

/**
 * Create and add to scene a eight ball
 *
 * @param scene
 * @param x
 * @param y
 *
 * @returns
 */
export function createEightBall(scene: Phaser.Scene, x: number, y: number) {
    const eightBall = createBall(scene, x, y, 'eight-ball', .25, .275);

    getMatterBody(eightBall).ignoreGravity = true;
    return eightBall;
}

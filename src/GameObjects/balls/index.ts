import { setWorldCollision } from "../../physics/matter";

/**
 * Create ball base
 *
 * @param scene
 * @param x
 * @param y
 * @param key
 * @param scale
 */
function createBall(scene: Phaser.Scene, x: number, y: number, key: string, scale: number, bounce: number) {
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
    const maxVelocity = new Phaser.Math.Vector2(height / 2, width / 2);
    maxVelocity.setAngle(0);

    const ball = createBall(scene, x, y, 'ball-124', .5, 1);
    // This ball must jumps out of screen
    ball.setOnCollide(function BouncyBallCollideListener(this: MatterJS.BodyType) {
        const newVec = maxVelocity.clone()
            .divide({ x: 0.1, y: 0.1 })
            .multiply({ x: this.mass, y: this.mass });
        // @todo: doom wall problem
        // @todo: mass problem
        // ball.applyForce(newVec);
        // this.positionImpulse
        // ball.thrust(500);
        ball.applyForce(newVec);
        console.log(newVec);
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
    return createBall(scene, x, y, 'eight-ball', .25, .275);
}


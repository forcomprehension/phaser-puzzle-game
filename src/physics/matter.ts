import { WORLD_STATIC } from "../constants/collision";

export function setWorldCollision(scene: Phaser.Scene, objects: Phaser.GameObjects.GameObject[]) {
    if (scene.game.config.physics.default === 'matter') {
        scene.matter.setCollisionCategory(objects.map((o) => o.body as MatterJS.BodyType), WORLD_STATIC);
    } else {
        throw new Error('Expects matter physics to be default');
    }
}

/**
 * Gets body and casts it to matter body physics type
 *
 * @param object
 */
export function getMatterBody(object: Phaser.GameObjects.GameObject) {
    return object.body as MatterJS.BodyType;
}

/**
 * Unsafe casts current body to {@see MatterJS.BodyType}. Use with caution
 */
export function unsafeCastBody(body: Phaser.Types.Physics.Matter.MatterBody) {
    return body as MatterJS.BodyType;
}

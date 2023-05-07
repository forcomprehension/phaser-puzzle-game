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

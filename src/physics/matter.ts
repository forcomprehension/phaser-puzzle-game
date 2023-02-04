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
 * 
 * @returns 
 */
export function castBody(object: Phaser.GameObjects.GameObject) {
    return object.body as MatterJS.BodyType;
}

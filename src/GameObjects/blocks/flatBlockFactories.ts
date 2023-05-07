import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { BaseFlatBlock } from "./BaseFlatBlock";
import type { iDraggable } from "@interfaces/iDraggable";
import { FlatBlockSpawnerType } from "./Spawners/flatBlockSpawnerType";

/**
 * Apply mixins for object
 */
export function applyMixins(object: BaseFlatBlock): BaseFlatBlock & iDraggable {
    // iDraggable applied in constructor
    return object as BaseFlatBlock & iDraggable;
}

/**
 * Main factory
 *
 * @param textureKey
 */
function flatBlockFactory(textureKey: string, spawnerType: FlatBlockSpawnerType) {
    return function BlockCreator(scene: BaseGameScene, x: number, y: number, width: number = 0) {
        return applyMixins(
            new BaseFlatBlock(scene, x, y, textureKey, spawnerType, width)
        )
    }
}


/**
 * Factory for flat metal block
 */
export const flatMetalBlockFactory = flatBlockFactory('flatMetalBlock', FlatBlockSpawnerType.Metal);

/**
 * Factory for flat wooden block
 */
export const flatWoodenBlockFactory = flatBlockFactory('flatWoodBlock', FlatBlockSpawnerType.Wood);

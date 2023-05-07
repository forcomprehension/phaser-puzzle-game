import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { BaseFlatBlock } from "./BaseFlatBlock";
import type { iDraggable } from "@interfaces/iDraggable";

/**
 * Apply mixins for object
 */
export function applyMixins(object: BaseFlatBlock): BaseFlatBlock & iDraggable {
    // iDraggable applied in constructor
    return object as BaseFlatBlock & iDraggable;
}

/**
 * Factory for flat metal block
 */
export function flatMetalBlockFactory(scene: BaseGameScene, x: number, y: number, width: number = 0) {
    return applyMixins(
        new BaseFlatBlock(scene, x, y, 'flatMetalBlock', width)
    );
}

/**
 * Factory for flat wooden block
 */
export function flatWoodenBlockFactory(scene: BaseGameScene, x: number, y: number, width: number = 0) {
    return applyMixins(
        new BaseFlatBlock(scene, x, y, 'flatWoodBlock', width)
    );
}

import type { BaseGameScene } from "@src/scenes/BaseGameScene";

/**
 * Add bg to scene and make it cover screen
 *
 * @param scene
 * @param imageKey
 */
export function addBackgroundImageCover(scene: BaseGameScene, imageKey: string) {
    const { canvasHeight, canvasWidth } = scene.getCanvasSize();

    const bgImage = scene.add.image(0, 0, imageKey)
        .setDepth(-1)
        .setOrigin(0);

    const scale = Math.max(
        canvasWidth / bgImage.displayWidth,
        canvasHeight / bgImage.displayHeight
    );

    bgImage.setScale(scale);

    return bgImage;
}

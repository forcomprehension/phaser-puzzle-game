
import { BaseGameScene } from '@src/scenes/BaseGameScene';
import Canvas from 'phaser3-rex-plugins/plugins/canvas';
import RoundRectangleCanvas from 'phaser3-rex-plugins/plugins/roundrectanglecanvas.js';

/**
 * Display
 */
export class MonochromeDisplay extends RoundRectangleCanvas {
    /**
     * Ctor
     *
     * @param scene
     * @param x
     * @param y
     * @param width
     */
    constructor(
        scene: BaseGameScene,
        x: number,
        y: number,
        width: number,
    ) {
        // Prefer aspect ratio
        const height = width / 3 * 2;

        super(scene, x, y, width, height, 4, function (
                _: Canvas,
                context: CanvasRenderingContext2D
            ) {
                var grd = context.createRadialGradient(
                    width / 2,
                    height / 2,
                    0,
                    width / 2,
                    height / 2,
                    width / 2, // @TODO:
                );

                grd.addColorStop(0, '#002222');
                grd.addColorStop(1, '#001111');
                return grd;
            } as any
        );

        scene.add.existing(this);
    }
}

import type { GearsManager } from "./GearsManager";

export function addGearsManagerTweens(scene: Phaser.Scene, gm: GearsManager) {
    scene.tweens.add({
        targets: gm,
        loop: -1,
        useFrames: true,
        duration: 86400 * 60, // 1 day
        onUpdate: () => {
            gm.updateRotations();
        },
        props: {
            rotation: {
                value: Phaser.Math.DegToRad(86400 * 360 / 4),
            },
        }
    });

    scene.tweens.add({
        targets: gm,
        loop: -1,
        useFrames: true,
        duration: 4,
        onUpdate: () => {
            gm.updateJammedRotations();
        },
        props: {
            jammedRotation: {
                yoyo: true,
                value: Phaser.Math.DegToRad(360 / 120)
            }
        }
    });
}

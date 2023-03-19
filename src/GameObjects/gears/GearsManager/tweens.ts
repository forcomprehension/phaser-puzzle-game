import { GearsManager } from "./GearsManager";

export function addGearsManagerTweens(scene: Phaser.Scene, gm: GearsManager) {
    scene.tweens.add({
        targets: gm,
        loop: -1,
        useFrames: true,
        onUpdate: () => {
            gm.updateRotations();
        },
        props: {
            jammedRotation: {
                yoyo: true,
                duration: 6,
                value: Phaser.Math.DegToRad(360 / 90)
            },
            rotation: {
                duration: 150,
                value: Phaser.Math.DegToRad(360),
            },
        }
    });
}

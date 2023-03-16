import { GearsManager } from "./GearsManager";

export function addGearsManagerTweens(scene: Phaser.Scene, gm: GearsManager) {
    scene.tweens.add({
        targets: [gm],
        duration: 3000,
        rotation: Phaser.Math.DegToRad(360),
        loop: -1,
        onUpdate: () => {
            gm.updateRotations();
        }
    });

    // @TODO: add stuck tween
}

import { BaseGameScene } from "@src/scenes/BaseGameScene";

export class CompileButton extends Phaser.GameObjects.Image {
    constructor(public scene: BaseGameScene, x: number, y: number) {
        super(scene, x, y, 'gear-12');

        this.setInteractive({
            setHandCursor: true,
        });

        this.setDepth(10000);
        scene.add.existing(this);
    }

    public addClickHandler(cb: Function) {
        this.on(Phaser.Input.Events.POINTER_UP, cb);
    }
}

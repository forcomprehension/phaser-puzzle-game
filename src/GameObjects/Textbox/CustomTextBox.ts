import { BaseGameScene } from "@src/scenes/BaseGameScene";
import { TextBox as TextBoxComponent } from "phaser3-rex-plugins/templates/ui/ui-components";

export class CustomTextBox extends TextBoxComponent {
    public static readonly BG_COLOR = 0x8719ff;
    public static readonly STROKE_STYLE = 0xFFFFFF;

    /**
     * Ctor
     */
    constructor(
        public scene: BaseGameScene,
        x: number,
        y: number,
        onEnd: () => void,
    ) {
        const textObject = scene.add.text(x, y, '', {
            fontSize: '32px',
            fontFamily: 'RobotoRegular',
            color: Phaser.Display.Color.IntegerToColor(CustomTextBox.STROKE_STYLE).rgba,
        }).setOrigin(.5).setDepth(1);

        const action = scene.add.image(0, 0, 'nextPage')
            .setTint(CustomTextBox.STROKE_STYLE)
            .setDepth(2);

        super(scene, {
            x,
            y,
            text: textObject,
            page: {
                maxLines: 4
            },
            type: {
                speed: 50,
            },
            action: action.setVisible(false),
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
                icon: 10,
                text: 10,
            },
            background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 4, CustomTextBox.BG_COLOR)
                .setStrokeStyle(4, CustomTextBox.STROKE_STYLE)
        });
        this.setInteractive();

        this.on('complete', () => {
            action.setVisible(true);
            this.once('pointerdown', () => {
                onEnd();
            });
        });

        scene.add.existing(this);
    }
}

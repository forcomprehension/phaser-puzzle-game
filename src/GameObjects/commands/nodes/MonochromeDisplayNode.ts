import { MonochromeDisplay } from "@GameObjects/displays/monochrome/MonochromeDisplay";
import { CommandNode } from "./CommandNode";
import { NodePin } from "../NodePin";
import { ON_PIN_CONNECTED, ON_PIN_DISCONNECTED } from "../nodepins/events";

export class MonochromeDisplayNode extends CommandNode {
    protected text: Optional<Phaser.GameObjects.Text>;

    protected createBaseComponents() {
        const display = new MonochromeDisplay(
            this.scene,
            0,
            0,
            400
        );

        const text = this.text = this.scene.add.text(0, 0, '00', {
            fontSize: '128px',
            color: 'rgba(192, 192, 192, 0.75)',
        })
            .setDepth(1)
            .setOrigin(0.5);

        // @todo:
        const height = display.height;
        const titleText = this.scene.add.text(0, -height / 2.5, 'Display()', {
            fontSize: '24px',
            color: 'rgba(192, 192, 192, 0.75)',
            fontFamily: 'RobotoRegular',
        })
            .setOrigin(.5)
            .setDepth(1);

        return {
            list: [
                display,
                text,
                titleText
            ],
            mainComponent: display,
        }
    }

    public getLeftPins() {
        const pin = new NodePin(this.scene, false);
        pin.once(ON_PIN_DISCONNECTED, (_: NodePin, other: NodePin) => {
            this.updateText('00');
        });

        return [
            pin
        ]
    }

    public updateText(text: string) {
        this.text?.setText(text);
    }

    public destroy(fromScene?: boolean | undefined): void {
        this.text = undefined;

        super.destroy(fromScene);
    }
}

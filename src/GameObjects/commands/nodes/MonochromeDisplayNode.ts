import { MonochromeDisplay } from "@GameObjects/displays/monochrome/MonochromeDisplay";
import { CommandNode } from "./CommandNode";
import { NodePin } from "../NodePin";
import { ON_PIN_DISCONNECTED } from "../nodepins/events";
import { PinPositionDescription } from "../pinPositionDescription";
import { CallNode } from "./CallNode";
import { IArgument } from "@src/classes/vm/ICallable";

/**
 * Monochrome display node
 */
export class MonochromeDisplayNode extends CallNode {
    public static readonly ACTOR_KEY = 'MonochromeDisplayNode';

    protected createBaseComponents() {
        const display = new MonochromeDisplay(
            this.scene,
            0,
            0,
            400
        );

        const text = this.textComponent = this.scene.add.text(0, 0, '00', {
            fontSize: '128px',
            color: 'rgba(192, 192, 192, 0.75)',
        })
            .setDepth(1)
            .setOrigin(.5);

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

    /**
     * @inheritdoc
     */
    public getLeftPins() {
        const pin = new NodePin(this.scene, PinPositionDescription.LEFT_PIN);
        pin.once(ON_PIN_DISCONNECTED, (_: NodePin) => {
            this.updateText('00');
        });

        return [
            pin
        ]
    }

    protected getLeftFlowPins(): NodePin[] {
        return [
            new NodePin(this.scene, PinPositionDescription.FLOW_LEFT_PIN)
        ]
    }

    /**
     * Receive data marker
     *
     * @param otherPin Sender pin
     */
    public receiveData(otherPin: NodePin, data: any, myPin: NodePin): void {
        super.receiveData(otherPin, data, myPin);

        // @todo: pin types
        if (otherPin.parentContainer instanceof CommandNode) {
            let dataCopy = data;
            // @TODO: MOVE TO UTILS
            if (typeof dataCopy === 'number' && String(dataCopy).includes('.')) {
                dataCopy = dataCopy.toFixed(2);
            }
            this.updateText(dataCopy);
        }
    }

    protected updateText(text: string) {
        this.textComponent?.setText(text);
    }

    public destroy(fromScene?: boolean | undefined): void {
        this.textComponent = undefined;

        super.destroy(fromScene);
    }

    public gameplayCall(...args: IArgument[]) {
        let dataCopy = args[0].value;

        if (typeof dataCopy === 'number' && String(dataCopy).includes('.')) {
            dataCopy = dataCopy.toFixed(2);
        }

        this.updateText(dataCopy);
    }
}

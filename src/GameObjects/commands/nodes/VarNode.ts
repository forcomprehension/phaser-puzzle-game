import { NodePin } from "../NodePin";
import { ON_PIN_CONNECTED } from "../nodepins/events";
import { CommandNode } from "./CommandNode";

export class VarNode extends CommandNode {
    protected ourValue: number = 0;

    protected getTextNode(): string {
        return '0';
    }

    public setVar(value: number) {
        this.ourValue = value;
        this.textComponent?.setText(String(value));
    }

    protected getRightPins(): NodePin[] {
        const rightPin = new NodePin(this.scene, true);

        this.on(ON_PIN_CONNECTED, (myPin: NodePin, other: NodePin) => {
            other.parentContainer.receiveData(myPin, this.ourValue, other);
        });

        return [
            rightPin
        ];
    }
}

import { checkNumberIsSuitable } from "@utils/number";
import { NodePin } from "../NodePin";
import { ON_PIN_CONNECTED, ON_PIN_DISCONNECTED } from "../nodepins/events";
import { CommandNode } from "./CommandNode";

export class VarNode extends CommandNode {
    public static readonly ACTOR_KEY = 'VarNode';

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

        let interval: any = 0;
        let connected: boolean = false; // If callback already passed to the queue
        this.on(ON_PIN_CONNECTED, (myPin: NodePin, other: NodePin) => {
            other.parentContainer.receiveData(myPin, this.ourValue, other);
            connected = true;

            // @TODO: SPIKE!!!
            interval = setInterval(() => {
                if (connected && other.parentContainer) {
                    other.parentContainer.receiveData(myPin, this.ourValue, other);
                }
            }, 333);
        });

        this.once(ON_PIN_DISCONNECTED, () => {
            connected = false;
            clearInterval(interval);
        });
        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            clearInterval(interval);
        });

        return [
            rightPin
        ];
    }

    /**
     * Sets extra data for actor with validation
     */
    public setDataWithValidation(variable: string|number): boolean {
        let value: number = 0;
        if (typeof variable === 'string') {
            value = Number(variable);
        } else if (typeof variable === 'number') {
            value = variable
        } else {
            return false;
        }

        const isValid = checkNumberIsSuitable(value);

        if (isValid) {
            this.setVar(value);
        }

        return isValid;
    }
}

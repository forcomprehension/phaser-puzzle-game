import { checkNumberIsSuitable } from "@utils/number";
import { NodePin } from "../NodePin";
import { ON_PIN_CONNECTED, ON_PIN_DISCONNECTED } from "../nodepins/events";
import { CommandNode, InstructionType } from "./CommandNode";
import { PinPositionDescription } from "../pinPositionDescription";
import { StackFrame } from "@src/classes/vm/StackFrame";
import { Scope } from "@src/classes/vm/Scope";

export class VarNode extends CommandNode {
    public static readonly ACTOR_KEY = 'VarNode';

    public ourValue: number = 0;

    // @TODO: SPIKE
    protected varName: string = (Math.random() * 8).toString(16);

    // @TODO: SPIKE
    protected scope: Scope;

    public readonly instructionType: InstructionType = InstructionType.VARIABLE;

    /**
     * @inheritdoc
     */
    protected getTextNode(): string {
        return '0';
    }

    public setVar(value: number) {
        this.ourValue = value;
        this.textComponent?.setText(String(value))
    }

    public executeValue(): Optional<StackFrame> {
        const frame = new StackFrame(this, null);
        frame.returnValue = () => this.ourValue;

        return frame
    }

    /**
     * Assign variable op
     *
     * @param name
     * @param frame
     * @param value
     */
    public assign(name: string, frame: StackFrame, value: number) {
        this.scope = frame.scope;
        this.varName = name;
        this.scope.assign(name, {
            type: 'variable',
            value
        });
    }

    /**
     * @inheritdoc
     */
    protected getRightPins(): NodePin[] {
        const rightPin = new NodePin(this.scene, PinPositionDescription.RIGHT_PIN);

        let interval: any = 0;
        let connected: boolean = false; // If callback already passed to the queue
        this.on(ON_PIN_CONNECTED, (myPin: NodePin, other: NodePin) => {
            if (!this.scope) {
                throw new ReferenceError(`Identifier ${this.varName} is not defined`);
            }
            other.parentContainer.receiveData(myPin, this.scope, other);
            connected = true;

            // @TODO: SPIKE!!!
            interval = setInterval(() => {
                if (connected && other.parentContainer) {
                    if (!this.scope) {
                        throw new ReferenceError(`Identifier ${this.varName} is not defined`);
                    }
                    other.parentContainer.receiveData(
                        myPin,
                        this.scope.get(this.varName),
                        other
                    );
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
     *
     * @TODO: CONNECT WITH STACK
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
            // @TODO: THIS WONT WORK UNTIL WE DOES NOT PUT IT ON THE REAL STACK!
            this.assign(this.name, new StackFrame(this, null, ''), value);
        }

        return isValid;
    }

    /** region IGraphProcessorAgent **/
 

    /** endregion IGraphProcessorAgent **/
}

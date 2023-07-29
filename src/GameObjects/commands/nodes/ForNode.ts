import { NodePin } from "../NodePin";
import { PinPositionDescription } from "../pinPositionDescription";
import { CommandNode, InstructionType } from "./CommandNode";

/**
 * Simply "for loop" node
 */
export class ForNode extends CommandNode {
    // Other node pin
    protected nextExecutionPin: NodePin;
    protected iterationCheckerResult: boolean = false;

    protected iterationsPin: NodePin;
    protected endPin: NodePin;

    protected startValuePin: NodePin;
    protected endValuePin: NodePin;

    protected mustStepIntoBody: boolean = false;

    public readonly instructionType: InstructionType = InstructionType.LOOP;

    protected getTextNode() {
        return 'FOR';
    }

    protected getLeftFlowPins(): NodePin[] {
        return [
            // Exec pin
            new NodePin(this.scene, PinPositionDescription.FLOW_LEFT_PIN),
        ];
    }

    protected getLeftPins(): NodePin[] {
        return [
            this.startValuePin = new NodePin(this.scene, PinPositionDescription.LEFT_PIN),
            this.endValuePin = new NodePin(this.scene, PinPositionDescription.LEFT_PIN),
        ];
    }

    protected getRightFlowPins(): NodePin[] {
        return [
            // End Pin
            this.endPin = new NodePin(this.scene, PinPositionDescription.FLOW_RIGHT_PIN),
            // Iteration Pin
            this.iterationsPin = new NodePin(this.scene, PinPositionDescription.FLOW_RIGHT_PIN),
        ];
    }

    public async executeNode(): Promise<void> {
       
    }

    protected startValue: number = 0;
    protected endValue: number = 0;
    protected currentIterationValue: number = 0;

    public initLoop() {
        // @TODO: reveal value from left pins
        const startValue = 0;
        const endValue = 5;
        this.currentIterationValue = startValue;

        let isDescending = startValue < endValue;
        this.startValue = isDescending ? endValue : startValue;
        this.endValue = isDescending ? startValue : endValue;
    }

    /**
     * Set next execution node
     *
     * @returns {Boolean} true - if we will step into body, false - if we will go after loop
     */
    public switchRailroadSwitch() {
        const result = this.mustStepIntoBody = this.currentIterationValue < this.endValue;

        return result;
    }

    /**
     * Third "for" for block
     */
    public advanceIteration() {
        this.currentIterationValue++;
    }

    public nextInstruction() {
        const otherPin = this.nextExecutionPin.getConnectedObject();

        if (otherPin instanceof NodePin) {
            return otherPin.parentContainer
        } else {
            return undefined
        }
    }

    public nextNode(): Optional<CommandNode> {
        if (this.mustStepIntoBody) {
            return this.nextInstruction();
        } else {
            return this.getEndNode()
        }
    }

    public getEndNode(): Optional<CommandNode> {
        const otherPin = this.endPin.getConnectedObject();
        if (otherPin instanceof NodePin) {
            return otherPin.parentContainer;
        } else {
            return undefined;
        }
    }
}

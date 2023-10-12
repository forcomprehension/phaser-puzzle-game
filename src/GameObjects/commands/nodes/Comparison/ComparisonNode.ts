import { NodePin } from "@GameObjects/commands/NodePin";
import { CommandNode, InstructionClass } from "../CommandNode";
import { PinPositionDescription } from "@GameObjects/commands/pinPositionDescription";
import { ComparisonOp } from "@src/classes/vm/Interpreter3";

/**
 * Abstract class for comparison nodes
 */
export abstract class ComparisonNode extends CommandNode {
    /**
     * Comparison node
     */
    abstract readonly comparisonType: ComparisonOp;

    /**
     * @inheritdoc
     */
    public readonly instructionClass: InstructionClass = InstructionClass.COMPARISON;

    /**
     * Out pin for current value
     */
    protected outPin: NodePin;

    /**
     * @inheritdoc
     */
    protected getRightPins(): NodePin[] {
        this.outPin = new NodePin(this.scene, PinPositionDescription.RIGHT_PIN);

        return [
            this.outPin
        ];
    }

    /**
     * @inheritdoc
     */
    protected getLeftPins(): NodePin[] {
        return [
            new NodePin(this.scene, PinPositionDescription.LEFT_PIN),
            new NodePin(this.scene, PinPositionDescription.LEFT_PIN),
        ];
    }

    /** region IGraphProcessorAgent **/
    public getNextInstruction(): Optional<CommandNode> {
        const connectedObject = this.outPin.getConnectedObject();
        if (connectedObject instanceof NodePin) {
            return connectedObject.parentContainer;
        }
    }
    /** endregion IGraphProcessorAgent **/
}

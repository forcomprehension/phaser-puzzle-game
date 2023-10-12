import { NodePin } from "../../NodePin";
import { CommandNode, InstructionClass } from "../CommandNode";
import { PinPositionDescription } from "@GameObjects/commands/pinPositionDescription";
import { MathOp } from "@src/classes/vm/Interpreter3";

/**
 * Abstract class for all simple math nodes
 */
export abstract class MathNode extends CommandNode {

    /**
     * Artithmetic operation type
     */
    abstract readonly mathOperationType: MathOp;

    /**
     * Gets left pins arguments in their order, for math operations
     */
    protected readonly inData: number[] = [];

    /**
     * Out result for math operation
     */
    protected outResult: number = 0;

    protected outPin: NodePin;

    /**
     * @inheritdoc
     */
    public readonly instructionClass: InstructionClass = InstructionClass.ARITHMETIC;

    /**
     * @inheritdoc
     */
    protected getRightPins(): NodePin[] {
        const resultPin = new NodePin(this.scene, PinPositionDescription.RIGHT_PIN);
        this.outPin = resultPin;

        // @TODO: better - on update data?
        // this.on(NODE_RECEIVE_DATA, () => {
        //     const connectedObject = resultPin.getConnectedObject();
        //     if (connectedObject instanceof NodePin) {
        //         const { parentContainer } = connectedObject;
        //         parentContainer.receiveData(resultPin, this.outResult, connectedObject);
        //     }
        // });

        return [
            resultPin,
        ];
    }

    /**
     * @inheritdoc
     */
    protected getLeftPins(): NodePin[] {
        return [
            new NodePin(this.scene, PinPositionDescription.LEFT_PIN),
            new NodePin(this.scene, PinPositionDescription.LEFT_PIN)
        ]
    }

    public getEmptyValue() {
        return 0;
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

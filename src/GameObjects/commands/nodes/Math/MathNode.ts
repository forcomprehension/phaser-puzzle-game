import { completeTo } from "@utils/array";
import { NodePin } from "../../NodePin";
import { CommandNode, InstructionType } from "../CommandNode";
import { NODE_RECEIVE_DATA } from "../events";
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

    public readonly instructionType: InstructionType = InstructionType.ARITHMETIC;

    /**
     * Aux initializer
     */
    protected init(): this {
        this.on(NODE_RECEIVE_DATA, (_: NodePin, data: any, myPin: NodePin) => {
            this.leftPinsList.forEach((currentLeftPin, index) => {
                if (currentLeftPin === myPin) {
                    // Update math values
                    if (typeof this.inData[index] === 'undefined') {
                        completeTo(this.inData, index, 0);
                    }

                    this.inData[index] = Number(data);

                    this.performMathOperation();
                }
            });
        });

        return super.init();
    }

    /**
     * Calculate math data
     */
    protected abstract performMathOperation(): void;

    /**
     * @inheritdoc
     */
    protected getRightPins(): NodePin[] {
        const resultPin = new NodePin(this.scene, PinPositionDescription.RIGHT_PIN);

        // @TODO: better - on update data?
        this.on(NODE_RECEIVE_DATA, () => {
            const connectedObject = resultPin.getConnectedObject();
            if (connectedObject instanceof NodePin) {
                const { parentContainer } = connectedObject;
                parentContainer.receiveData(resultPin, this.outResult, connectedObject);
            }
        });

        return [
            resultPin,
        ];
    }

    /**
     * @inheritdoc
     */
    protected getLeftPins(): NodePin[] {
        const lhsPin = new NodePin(this.scene, PinPositionDescription.LEFT_PIN);
        const rhsPin = new NodePin(this.scene, PinPositionDescription.LEFT_PIN);

        return [ // @TODO: why in reversed order?
            rhsPin,
            lhsPin
        ]
    }

    public getEmptyValue() {
        return 0;
    }
}

import { completeTo } from "@utils/array";
import { NodePin } from "../../NodePin";
import { CommandNode } from "../CommandNode";
import { NODE_RECEIVE_DATA } from "../events";
import { ON_PIN_CONNECTED } from "@GameObjects/commands/nodepins/events";

/**
 * Abstract class for all simple math nodes
 */
export abstract class MathNode extends CommandNode {
    /**
     * Gets left pins arguments in their order, for math operations
     */
    protected readonly inData: number[] = [];

    /**
     * Out result for math operation
     */
    protected outResult: number = 0;

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

    protected getRightPins(): NodePin[] {
        const resultPin = new NodePin(this.scene, true);

        // @TODO: better - on update data?
        this.on(NODE_RECEIVE_DATA, () => {
            const connectedObject = resultPin.getConnectedObject();
            if (connectedObject instanceof NodePin) {
                const { parentContainer } = connectedObject;
                if (parentContainer instanceof CommandNode) {
                    parentContainer.receiveData(resultPin, this.outResult, connectedObject);
                }
            }
        });

        return [
            resultPin,
        ];
    }

    protected getLeftPins(): NodePin[] {
        const multiplierPin = new NodePin(this.scene, false);
        const multipliedPin = new NodePin(this.scene, false);

        return [
            multipliedPin,
            multiplierPin
        ]
    }
}

import { MathOp } from "@src/classes/vm/Interpreter3";
import { MathNode } from "./MathNode";

/**
 * Multiply node
 */
export class MultiplicationNode extends MathNode {
    public readonly mathOperationType: MathOp = MathOp.MULTIPLY;
    public static readonly ACTOR_KEY = 'MultiplicationNode';

    protected getTextNode(): string {
        return 'x';
    }

    protected performMathOperation() {
        // @TODO: implement overflow
        this.outResult = this.inData.reduce((acc, currentValue) => acc * currentValue, 1);
    }
}

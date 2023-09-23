import { MathOp } from "@src/classes/vm/Interpreter3";
import { MathNode } from "./MathNode";

export class AddNode extends MathNode {
    public readonly mathOperationType: MathOp = MathOp.ADD;
    protected getTextNode(): string {
        return '+';
    }

    protected performMathOperation() {
        // @TODO: implement overflow
        this.outResult = this.inData.reduce((acc, currentValue) => acc + currentValue, 0);
    }
}


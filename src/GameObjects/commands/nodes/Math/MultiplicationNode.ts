import { MathNode } from "./MathNode";

export class MultiplicationNode extends MathNode {

    protected getTextNode(): string {
        return 'x';
    }

    protected performMathOperation() {
        // @TODO: implement overflow
        this.outResult = this.inData.reduce((acc, currentValue) => acc * currentValue, 1);
    }
}

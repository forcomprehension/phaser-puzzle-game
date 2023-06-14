import { MathNode } from "./MathNode";

export class AddNode extends MathNode {
    protected getTextNode(): string {
        return '+';
    }

    protected performMathOperation() {
        // @TODO: implement overflow
        this.outResult = this.inData.reduce((acc, currentValue) => acc + currentValue, 0);
    }
}


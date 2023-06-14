import { MathNode } from "./MathNode";

export class SubtractNode extends MathNode {
    protected getTextNode(): string {
        return '-';
    }

    protected performMathOperation() {
        // @TODO: check overflow
        this.outResult = this.inData[0];
        for (let i = 1; i < this.inData.length; i++) {
            this.outResult -= this.inData[i];
        }
    }
}

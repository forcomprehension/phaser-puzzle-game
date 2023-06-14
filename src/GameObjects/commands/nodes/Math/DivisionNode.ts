import { MathNode } from "./MathNode";

/**
 * Division implementation
 */
export class DivisionNode extends MathNode {
    protected getTextNode(): string {
        return '/';
    }

    protected performMathOperation() {
        // @TODO: check exp
        // @todo: support division by zero
        this.outResult = this.inData[0];
        for (let i = 1; i < this.inData.length; i++) {
            this.outResult /= this.inData[i];
        }
    }
}

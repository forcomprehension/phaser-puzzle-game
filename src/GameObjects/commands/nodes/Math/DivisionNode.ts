import { MathNode } from "./MathNode";

/**
 * Division implementation
 */
export class DivisionNode extends MathNode {
    public static readonly ACTOR_KEY = 'DivisionNode';

    protected getTextNode(): string {
        return '/';
    }

    protected performMathOperation() {
        // @TODO: check exp
        // @todo: support division by zero
        try {
            this.outResult = this.inData[0];

            for (let i = 1; i < this.inData.length; i++) {
                this.outResult /= this.inData[i];
            }
        } catch (e) {
            this.outResult = 0;
        }
    }
}

import { MathOp } from "@src/classes/vm/Interpreter3";
import { MathNode } from "./MathNode";

/**
 * Division implementation
 */
export class DivisionNode extends MathNode {
    public readonly mathOperationType: MathOp = MathOp.DIVIDE;
    public static readonly ACTOR_KEY = 'DivisionNode';

    protected getTextNode(): string {
        return '/';
    }
}

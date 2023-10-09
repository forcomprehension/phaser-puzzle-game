import { MathOp } from "@src/classes/vm/Interpreter3";
import { MathNode } from "./MathNode";

/**
 * Subtraction node
 */
export class SubtractNode extends MathNode {
    public readonly mathOperationType: MathOp = MathOp.SUBTRACT;

    public static readonly ACTOR_KEY = 'SubtractNode';

    protected getTextNode(): string {
        return '-';
    }
}

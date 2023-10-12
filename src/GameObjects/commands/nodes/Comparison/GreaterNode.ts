import { ComparisonOp } from "@src/classes/vm/Interpreter3";
import { ComparisonNode } from "./ComparisonNode";

export class GreaterNode extends ComparisonNode {
    public static readonly ACTOR_KEY = 'GreaterNode';

    public readonly comparisonType: ComparisonOp = ComparisonOp.GT;

    public getTextNode(): string {
        return '>';
    }
}

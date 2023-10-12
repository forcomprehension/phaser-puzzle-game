import { ComparisonOp } from "@src/classes/vm/Interpreter3";
import { ComparisonNode } from "./ComparisonNode";

export class GreaterOrEqualNode extends ComparisonNode {
    public static readonly ACTOR_KEY = 'GreaterOrEqualNode';

    public readonly comparisonType: ComparisonOp = ComparisonOp.GE;

    public getTextNode(): string {
        return '>=';
    }
}

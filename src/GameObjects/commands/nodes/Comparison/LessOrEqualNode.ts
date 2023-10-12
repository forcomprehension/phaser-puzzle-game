import { ComparisonOp } from "@src/classes/vm/Interpreter3";
import { ComparisonNode } from "./ComparisonNode";

export class LessOrEqualNode extends ComparisonNode {
    public static readonly ACTOR_KEY = 'LessOrEqualNode';

    public readonly comparisonType: ComparisonOp = ComparisonOp.LE;

    public getTextNode(): string {
        return '<=';
    }
}

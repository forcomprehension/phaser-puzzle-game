import { ComparisonOp } from "@src/classes/vm/Interpreter3";
import { ComparisonNode } from "./ComparisonNode";

export class LessNode extends ComparisonNode {
    public static readonly ACTOR_KEY = 'LessNode';

    public readonly comparisonType: ComparisonOp = ComparisonOp.LT;

    public getTextNode(): string {
        return '<';
    }
}

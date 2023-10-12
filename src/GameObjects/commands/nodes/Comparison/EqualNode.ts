 import { ComparisonOp } from "@src/classes/vm/Interpreter3";
import { ComparisonNode } from "./ComparisonNode";

export class EqualNode extends ComparisonNode {
    public static readonly ACTOR_KEY = 'EqualNode';

    public readonly comparisonType: ComparisonOp = ComparisonOp.EQ;

    public getTextNode(): string {
        return '==';
    }
}

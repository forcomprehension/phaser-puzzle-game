import { MathOp } from "@src/classes/vm/Interpreter3";
import { MathNode } from "./MathNode";

export class ModuloNode extends MathNode {
    public readonly mathOperationType: MathOp = MathOp.MODULO;
    public static readonly ACTOR_KEY = 'ModuloNode';

    protected getTextNode(): string {
        return '%';
    }
}

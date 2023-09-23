import { NodePin } from "../NodePin";
import { CommandNode, InstructionType } from "./CommandNode";

export class CallNode extends CommandNode {
    public instructionType: InstructionType = InstructionType.CALL;

    public evaluate() {

    }
}


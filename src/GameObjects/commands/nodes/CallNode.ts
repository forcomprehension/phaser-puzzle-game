import type { IGameplayFunctionAgent } from "@src/classes/functions/IGameplayFunctionAgent";
import { CommandNode, InstructionType } from "./CommandNode";
import type { IArgument } from "@src/classes/vm/ICallable";

export class CallNode extends CommandNode implements IGameplayFunctionAgent {
    public instructionType: InstructionType = InstructionType.CALL;

    // region IGameplayFunctionAgent
    public gameplayCall(...args: IArgument[]) {
        throw new Error("Method not implemented.");
    }

    public functionLength(): number {
        return this.leftPinsList.length;
    }
    // endregion IGameplayFunctionAgent
}


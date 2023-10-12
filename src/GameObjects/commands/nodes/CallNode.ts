import type { IGameplayFunctionAgent } from "@src/classes/functions/IGameplayFunctionAgent";
import { CommandNode, InstructionClass } from "./CommandNode";
import type { IArgument } from "@src/classes/vm/ICallable";
import { NodePin } from "../NodePin";
import { CALL_ACTOR_CALLED, CALL_ACTOR_CALLED_WITH } from "./events";

export class CallNode extends CommandNode implements IGameplayFunctionAgent {
    public instructionClass: InstructionClass = InstructionClass.CALL;

    // region IGameplayFunctionAgent
    public gameplayCall(...args: IArgument[]) {
        throw new Error("Method not implemented.");
    }

    public functionLength(): number {
        return this.leftPinsList.length;
    }

    public callWillBePerformedWith(args: Readonly<IArgument>[]): void {
        this.emit(CALL_ACTOR_CALLED_WITH, args);
    }

    public notifySuccessfulCall(): void {
        this.emit(CALL_ACTOR_CALLED);
    }
    // endregion

    /** region IGraphProcessorAgent **/
    public getNextInstruction(): Optional<CommandNode> {
        const pin = this.rightPinsList[0];
        if (pin instanceof NodePin) {
            const connectedObject = pin.getConnectedObject();
            if (connectedObject instanceof NodePin) {
                return connectedObject.parentContainer;
            }
        }
    }
    /** endregion IGraphProcessorAgent **/
}


import type { CallStack } from "./CallStack";
import type { Debugger } from "./Debugger";
import type { StackFrame } from "./StackFrame";

/**
 * VM interpreted
 *
 * @module vm
 */
export class Interpreter {
    /**
     * Run stack
     *
     * @param stack
     */
    public async executeStack(stack: CallStack, _debugger?: Debugger) {
        while(stack.hasParentFrame()) {
            const frame = stack.pop();

            if (frame) {
                this.step(frame, _debugger);
            }
        }
    }

    /**
     * Execute interpreter step
     *
     * @param frame
     */
    protected async step(frame: StackFrame, _debugger?: Debugger) {
        frame.attachDebugger(_debugger);

        do {
            await frame.executeCommand();
        } while (frame.next());

        frame.detachDebugger();
    }
}

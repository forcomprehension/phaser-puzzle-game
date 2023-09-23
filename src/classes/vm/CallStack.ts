import { StackFrame } from "./StackFrame";

/**
 * Call stack representation
 *
 * @module vm
 */
export class CallStack {
    /**
     * Max stack size
     */
    public static readonly MAX_STACK_SIZE = 1000;

    /**
     * Stack
     */
    protected readonly stack: StackFrame[] = [];

    /**
     * Can we pop stack?
     *
     * @returns
     */
    public hasParentFrame() {
        return this.stack.length > 1;
    }

    /**
     * Pops call stack
     */
    public pop() {
        const head = this.stack.pop();

        if (!head) {
            console.warn('Called stack.pop on empty call stack');
        }

        return head;
    }

    /**
     * Push stack frame to a stack
     *
     * @param frame
     */
    public push(frame: StackFrame) {
        this.checkStackOverflow();

        this.stack.push(frame);
    }

    /**
     * Get function names until frame, includes passed frame
     *
     * @param frame
     */
    public getFunctionNamesUntilIncluding(frame: StackFrame) {
        const names: string[] = [];
        for (let i = 0; i < this.stack.length; i++) {
            names.push(this.stack[i].functionName);

            if (this.stack[i] === frame) {
                break;
            }
        }

        return names;
    }

    /**
     * Make our stack overflow checker
     */
    protected checkStackOverflow() {
        if (this.stack.length > CallStack.MAX_STACK_SIZE) {
            throw new Error('Stack overflow');
        }
    }
}

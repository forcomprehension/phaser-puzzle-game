import type { CommandNode } from "@GameObjects/commands/nodes/CommandNode";
import { Scope } from "./Scope";

/**
 * Stack frame representation
 *
 * @module vm
 */
export class StackFrame {
    protected currentInstruction: CommandNode;
    public readonly scope: Scope;
    // @TODO:
    public returnValue: () => any;

    protected overrideForNextInstruction: Optional<CommandNode>;

    /**
     * Getter for current
     */
    public get current() {
        return this.currentInstruction;
    }

    // @TODO: Add breakpoint here?

    // Entrypoint
    constructor(
        entryPoint: CommandNode,
        parentScope: Nullable<Scope>,
        public readonly functionName: string = 'Anonymous'
    ) {
        this.currentInstruction = entryPoint;
        this.scope = new Scope(parentScope);
    }

    /**
     * Next instruction
     */
    public next(): Optional<CommandNode> {
        const overriddenInstruction = this.overrideForNextInstruction;
        this.overrideForNextInstruction = undefined;
        return overriddenInstruction || this.currentInstruction.nextNode();
    }

    /**
     * @returns {Boolean} If next instruction is nil
     */
    public nextInstructionIsNil() {
        return !(this.overrideForNextInstruction || this.currentInstruction.nextNode());
    }

    public async frameStep(): Promise<void> {
       // @TODO: how to check breakpoint?
       return this.currentInstruction.executeNode();
    }

    public setNextInstructionOverride(next: Optional<CommandNode>) {
        this.overrideForNextInstruction = next;
    }
}


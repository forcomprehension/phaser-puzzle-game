import type { CommandNode } from "@GameObjects/commands/nodes/CommandNode";
import { Debugger } from "./Debugger";

export class StackFrame {
    constructor(protected readonly entryPoint: CommandNode) {}

    public attachDebugger(_debugger?: Debugger | undefined): void {
        throw new Error("Method not implemented.");
    }

    public detachDebugger(): void {
        throw new Error("Method not implemented.");
    }

    public next(): Optional<CommandNode> {
        throw new Error("Method not implemented.");
    }

    public executeCommand(): Promise<void> {
        // Execute command
        throw new Error("Method not implemented.");
    }
}


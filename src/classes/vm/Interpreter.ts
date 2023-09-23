import { CommandNode, InstructionType } from "@GameObjects/commands/nodes/CommandNode";
import type { CallStack } from "./CallStack";
import type { Debugger } from "./Debugger";
import { StackFrame } from "./StackFrame";
import { ForNode } from "@GameObjects/commands/nodes/ForNode";
import { LiteralNode } from "@GameObjects/commands/nodes/LiteralNode";

export type PossibleException = Optional<{
    nativeException: unknown,
    errorStack: string[],
}>

/**
 * VM interpreter
 *
 * @module vm
 */
export class Interpreter {
    /**
     * Run stack
     *
     * @param stack
     */
    public executeStack(stack: CallStack, _debugger?: Debugger): PossibleException {
        let exception: PossibleException;

        while (!exception && stack.hasParentFrame()) {
            const frame = stack.pop();

            if (frame) {
                exception = this.stackStep(frame, _debugger);

                if (exception) {
                    exception.errorStack = stack.getFunctionNamesUntilIncluding(frame);
                    break;
                }
            }
        }

        return exception;
    }

    /**
     * Execute interpreter step
     *
     * @param frame
     */
    protected stackStep(frame: StackFrame, _debugger?: Debugger): PossibleException {
        let caughtException: PossibleException;

        type BlockEntry = {
            nextInstruction: Optional<CommandNode>,
            currentInstruction: CommandNode,
            isLoop: boolean,
        };

        /**
         * Create additional internal stack for basic blocks
         *
         * @link https://en.wikipedia.org/wiki/Basic_block
         */
        const blocksStack: BlockEntry[] = [];
        do {
            try {
                const instruction = frame.current;
                const instructionType = instruction.instructionType;

                switch (instructionType) {
                    case InstructionType.LITERAL: {
                        // @TODO: VALUE PIN?
                        // How to execute?
                        (instruction as LiteralNode).assign(
                            (instruction as LiteralNode).name,
                            frame,
                            (instruction as LiteralNode).ourValue
                        );
                    }
                    case InstructionType.BRANCH: {
                        // If instruction will be regulated by frame.next()
                    }
                    case InstructionType.BREAK: {
                        // Loop
                        if (blocksStack.length > 0 && blocksStack[blocksStack.length - 1].isLoop) {
                            // Move out from loop and set instruction after loop as next instruction
                            const parentBlock = blocksStack.pop();
                            frame.setNextInstructionOverride(parentBlock!.nextInstruction);
                        } else {
                            throw new Error('Cannot use "break" nowhere but loop direct child block');
                        }
                    }
                    case InstructionType.CONTINUE: {
                        // Loop
                        if (blocksStack.length > 0 && blocksStack[blocksStack.length - 1].isLoop) {
                            frame.setNextInstructionOverride(undefined);
                        } else {
                            throw new Error('Cannot use "continue" nowhere but loop direct child block');
                        }
                    }
                    case InstructionType.LOOP: {
                        /**
                         * In loop, we push loop level block into blocks stack
                         *
                         * {@see ForNode::switchRailroadSwitch} will evaluate condition and switch next stack node
                         * to loop body or instruction after body
                         */
                        if (instruction instanceof ForNode) {
                            instruction.initLoop();

                            if (instruction.switchRailroadSwitch()) {
                                blocksStack.push({
                                    currentInstruction: instruction,
                                    nextInstruction: instruction.getEndNode(),
                                    isLoop: true,
                                });
                            } // Just ignore the loop if switch returns false.
                            // This means we must just proceed to next node after loop
                        }
                    }
                    case InstructionType.LITERAL: {
                        const value = instruction.executeValue();
                        if (value instanceof StackFrame) {
                            // @TODO:
                            frame.setNextInstructionOverride(value.current);
                        }
                    }
                    default: {
                        instruction.executeNode();
                    }
                }

                if (frame.nextInstructionIsNil()) {
                    if (blocksStack.length) {
                        let nextBlock;
                        while (blocksStack.length) {
                            nextBlock = blocksStack.pop()!;
                            // if parent isLoop
                            if (nextBlock.isLoop) {
                                // Advance iteration after loop block
                                (nextBlock.nextInstruction as ForNode).advanceIteration();
                                // If we step into body once again, push this block one more time
                                if ((nextBlock.nextInstruction as ForNode).switchRailroadSwitch()) {
                                    blocksStack.push(nextBlock);
                                    break;
                                }
                            } else if (nextBlock.nextInstruction) { // Next instruction
                                // is instruction AFTER popped block
                                frame.setNextInstructionOverride(nextBlock.nextInstruction);
                                break;
                            }

                            nextBlock = blocksStack.pop();
                        }
                        // If we found an instruction we will continue execution in this stack frame/block
                        // We pop stack otherwise
                    }
                }

            } catch (e) {
                caughtException = {
                    nativeException: e,
                    errorStack: []
                };
            }
        } while (!caughtException && frame.next());

        return caughtException;
    }
}

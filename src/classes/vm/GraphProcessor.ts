import { CommandNode, InstructionType } from "@GameObjects/commands/nodes/CommandNode";
import { OpType } from "./Interpreter2";
import { IfNode } from "@GameObjects/commands/nodes/IfNode";
import { nextString } from "@utils/serialGenerator";
import { ForNode } from "@GameObjects/commands/nodes/ForNode";
import { CallNode } from "@GameObjects/commands/nodes/CallNode";
import { FunctionType } from '@src/classes/functions/F';
import { MathNode } from "@GameObjects/commands/nodes/Math/MathNode";


export type ListStatement = {
    opType: OpType;
    arg: unknown
};

/**
 * Convert connected nodes graph to statements list
 */
export class GraphProcessor {
    public convertFrom(entryNode: CommandNode): ListStatement[] {
        const list: ListStatement[] = [];

        this.stepInto(entryNode, list);

        return list;
    }

    protected processBranch(node: IfNode, outPtr: ListStatement[]) {
        const conditionNode = node.getConditionRule();
        const { trueNode, falseNode } = node.getBranchesStruct();

        /**
         * Instructions list
         *
         * // Condition
         * ...
         * <calculate condition>
         * ...
         * PUSH boolean
         * (hasElse &&) JUMP_IF_FALSE
         * // true block
         * ...
         *  true instructions
         *  GOTO END_LABEL
         * ...
         * // false block (has else)
         * ...
         *  false instructions
         * ...
         * LABEL END_LABEL
         */

        if (conditionNode) {
            // Result will be added internal
            this.stepInto(conditionNode, outPtr);
        } else {
            // By default, condition will be false
            outPtr.push({
                opType: OpType.PUSH,
                arg: false
            });
        }

        const falseNodeLabelId = nextString();
        const endLabel = nextString();

        if (falseNode) {
            outPtr.push({
                opType: OpType.JUMP_IF_FALSE,
                arg: falseNodeLabelId
            });
        }

        if (trueNode) {
            this.stepInto(trueNode, outPtr);

            outPtr.push({
                opType: OpType.LABEL,
                arg: endLabel
            });
        }

        if (falseNode) {
            outPtr.push({
                opType: OpType.LABEL,
                arg: falseNodeLabelId
            });

            this.stepInto(falseNode, outPtr);
        }

        // Label for jumping out of IF
        outPtr.push({
            opType: OpType.LABEL,
            arg: endLabel,
        });
    }

    protected processLoop(node: ForNode, outPtr: ListStatement[]) {
        // Get start entity
        const startEntity = node.getStartEntity();
        const currentVariableName = `@@loop_${nextString()}`;

        // Calculate start entity
        if (startEntity instanceof CommandNode) {
            // @TODO: how to get value?
            this.stepInto(startEntity, outPtr);

            // @TODO: what if it is won't be pushed?
            // @TODO: redundant variable exchange
            const startVar = outPtr[outPtr.length - 1]  ;

            outPtr.push({
                opType: OpType.ASSIGN,
                arg: [
                    currentVariableName,
                    startVar
                ]
            });
        } else {
            // in other case we will assign literal value or default 0
            outPtr.push({
                opType: OpType.ASSIGN,
                arg: [
                    currentVariableName,
                    typeof startEntity === 'number' ? startEntity : 0
                ]
            });
        }

        // Get end entity
        const endEntity = node.getEndEntity();
        const endVariableName = `@@loop_${nextString()}`;

         // Calculate end entity
         if (endEntity instanceof CommandNode) {
            // @TODO: how to get value?
            this.stepInto(endEntity, outPtr);

            // @TODO: what if it is won't be pushed?
            // @TODO: redundant variable exchange
            const endVar = outPtr[outPtr.length - 1];

            outPtr.push({
                // @TODO: PUSH?
                opType: OpType.ASSIGN,
                arg: [
                    endVariableName,
                    endVar
                ]
            });
        } else {
            // in other case we will assign literal value or default 0
            outPtr.push({
                // @TODO: PUSH?
                opType: OpType.ASSIGN,
                arg: [
                    endVariableName,
                    typeof endEntity === 'number' ? endEntity : 0
                ]
            });
        }

        // Make label here for jumping from body
        const loopStartLabel = nextString();
        outPtr.push({
            opType: OpType.LABEL,
            arg: loopStartLabel
        });

        // Start and end values was stored. Let's make a comparison

        outPtr.push({
            opType: OpType.LOAD,
            arg: currentVariableName
        });

        outPtr.push({
            opType: OpType.LOAD,
            arg: endVariableName
        });

        // Condition check
        outPtr.push({
            opType: OpType.LT,
            arg: undefined // taken from stack
        });

        // Doing with out label
        const loopOutLabel = nextString();
        outPtr.push({
            opType: OpType.JUMP_IF_FALSE,
            arg: loopOutLabel
        });

        // Step into the body if it exists
        const firstBodyInstruction = node.getFirstInstruction();
        if (firstBodyInstruction) {
            this.stepInto(firstBodyInstruction, outPtr);
        }

        // Increment current value
        outPtr.push({
            opType: OpType.INC,
            arg: currentVariableName,
        });

        // Rewind to condition checking
        outPtr.push({
            opType: OpType.BACK_TO_LABEL,
            arg: loopStartLabel,
        });

        // Label for jumping out of loop
        outPtr.push({
            opType: OpType.LABEL,
            arg: loopOutLabel
        });
    }

    protected processCall(node: CallNode, outPtr: ListStatement[]) {
        // Collect arguments
        // Evaluate them
        // Create stack frame
        // Pop into function

        node.collectArgs().forEach((arg: Optional<CommandNode>) => {
            if (arg) {
                this.stepInto(arg, outPtr);
            } else {
                // push undefined arg
                outPtr.push({
                    opType: OpType.PUSH,
                    arg: undefined
                });
            }
        });

        outPtr.push({
            opType: OpType.CALL,
            arg: [
                FunctionType.GAMEPLAY, // @TODO
                undefined  // @TODO: FQN
            ]
        });
    }

    protected processMath(nextNode: MathNode, outPtr: ListStatement[]) {
        let operandsCount = 0;
        nextNode.collectArgs().forEach((arg) => {
            if (arg) {
                this.stepInto(arg, outPtr);
            } else {
                outPtr.push({
                    opType: OpType.PUSH,
                    arg: nextNode.getEmptyValue()
                })
            }

            operandsCount++;
        })

        outPtr.push({
            opType: OpType.ARITHMETIC,
            arg: [
                operandsCount,
                nextNode.mathOperationType
            ]
        });
    }

    protected stepInto(nextNode: CommandNode, outPtr: ListStatement[]) {
        const { instructionType } = nextNode;
        switch (instructionType) {
            case InstructionType.BRANCH: {
                if (nextNode instanceof IfNode) {
                    this.processBranch(nextNode, outPtr);
                    break;
                }

                GraphProcessor.throwNodeIsCorrupted(nextNode);
            }

            case InstructionType.LOOP: {
                if (nextNode instanceof ForNode) {
                    this.processLoop(nextNode, outPtr);
                    break;
                }

                GraphProcessor.throwNodeIsCorrupted(nextNode);
            }

            case InstructionType.CALL: {
                if (nextNode instanceof CallNode) {
                    this.processCall(nextNode, outPtr);
                    break;
                }

                GraphProcessor.throwNodeIsCorrupted(nextNode);
            }

            case InstructionType.ARITHMETIC: {
                if (nextNode instanceof MathNode) {
                    this.processMath(nextNode, outPtr);
                    break
                }

                GraphProcessor.throwNodeIsCorrupted(nextNode);
            }
        }
    }

    protected static throwNodeIsCorrupted(node: CommandNode) {
        const name = Object.getPrototypeOf(node)?.constructor?.name || 'unknown';
        throw new Error(`Node ${name} of type "${node.instructionType}" is corrupted`);
    }
}

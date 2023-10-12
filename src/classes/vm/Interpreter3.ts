import { ListStatement, StatementAssignArg, StatementCallArg, StatementMathArg } from "../GraphProcessor";
import { MathErrorCodes, MathException } from "../exceptions/math/MathException";
import type { IArgument, ICallable } from "./ICallable";
import { OpType } from "./Interpreter2";

export enum ComparisonOp {
    LT = "<",
    LE = "<=",
    GT = ">",
    GE = ">=",
    EQ = "=="
}

export enum MathOp {
    ADD = "+",
    DIVIDE = "/",
    MULTIPLY = "*",
    SUBTRACT = "-",
    MODULO = '%',
}

class Stack3 {
    protected stack: any[] = [];

    public push(value: any) {
        this.stack.push(value);
    }

    public pop() {
        return this.stack.pop();
    }

    public popFew(count: number) {
        const tmp = this.stack.slice(-count);
        this.stack.length -= count;

        return tmp;
    }
}

class Scope3 {
    protected readonly variables: Map<string, any> = new Map();

    public assign(name: string, value: any) {
        this.variables.set(name, value);
    }

    public get(name: string) {
        return this.variables.get(name);
    }
}

class State3 {
    public readonly stack: Stack3 = new Stack3();
    public readonly scope: Scope3 = new Scope3();
}

enum StepReturnReason {
    SUCCESS,
    MOVE_TO_LABEL,
    BACK_TO_LABEL,
}

type StepReturnValue = {
    type: StepReturnReason.MOVE_TO_LABEL,
    label: string,
} | {
    type: StepReturnReason.BACK_TO_LABEL,
    label: string,
} | {
    type: StepReturnReason.SUCCESS
};

const returnSuccess: StepReturnValue = {
    type: StepReturnReason.SUCCESS
} as const;

export class Interpreter3 {
    protected statementCursor: number = 0;
    public readonly state = new State3();

    /**
     * Execute current frame
     *
     * @param statements
     */
    constructor( // @TODO: Scope will be ride from there?
        protected readonly statements: Readonly<ListStatement[]>
    ) {}

    /**
     * Run through commands list
     */
    public continue() {
        for (let i = this.statementCursor; i < this.statements.length; i++) {
            const result = this.step(this.statements[i], i, this.state);

            switch (result.type) {
                case StepReturnReason.MOVE_TO_LABEL: {
                    const index = this.lookForwardForIndex(i, result.label);

                    if (index === undefined) {
                        throw new Error(`Cannot find label ${result.label}`);
                    }

                    i = index;
                    break;
                }

                case StepReturnReason.BACK_TO_LABEL: {
                    const index = this.lookBackwardForIndex(i, result.label);

                    if (index === undefined) {
                        throw new Error(`Cannot find label ${result.label}`);
                    }

                    i = index;
                    break;
                }
            }

            this.statementCursor = i;
        }
    }

    /**
     * Search label forward in list of statements
     *
     * @param currentIteration
     * @param searchLabel
     */
    protected lookForwardForIndex(currentIteration: number, searchLabel: string) {
        for (let j = currentIteration + 1; j < this.statements.length; j++) {
            const currentStatement = this.statements[j];
            if (currentStatement.arg === searchLabel) {
                return j;
            }
        }
    }

    /**
     * Search label backward in list of statements
     *
     * @param currentIteration
     * @param searchLabel
     */
    protected lookBackwardForIndex(currentIteration: number, searchLabel: string) {
        for (let j = currentIteration - 1; j >= 0; j--) {
            // Search backward
            const currentStatement = this.statements[j];
            if (currentStatement.arg === searchLabel) {
                return j;
            }
        }
    }

    /**
     * Step
     *
     * @param statement
     */
    protected step(statement: ListStatement, statementIndex: number, state: State3): StepReturnValue {
        const { stack } = state;
        switch (statement.opType) {
            case OpType.ARITHMETIC: {
                const { operandsCount, operationType } = statement.arg as StatementMathArg;
                this.stepArithmetic(operandsCount, operationType);
                break;
            }
            case OpType.ASSIGN: {
                const { variableName, value }= statement.arg as StatementAssignArg;
                this.state.scope.assign(variableName, value);
                break;
            }
            case OpType.BLOCK:
            case OpType.BRANCH:
            case OpType.BREAK:
                break;

            case OpType.INC: {
                this.stepIncrement();
                break;
            }
            case OpType.COMPARISON: {
                const op = statement.arg as ComparisonOp;
                this.stepComparison(op);
                break;
            }
            case OpType.LOAD: {
                stack.push(
                    state.scope.get(statement.arg as string)
                );
                break;
            }
            case OpType.CALL: {
                this.stepCall(statement, stack);
                break;
            }

            case OpType.JUMP: {
                return {
                    type: StepReturnReason.MOVE_TO_LABEL,
                    label: statement.arg as string,
                };
            }
            case OpType.PUSH: {
                stack.push(statement.arg);
                break;
            }
            case OpType.JUMP_IF_FALSE: {
                const result = stack.pop();
                if (!result) {
                    return {
                        type: StepReturnReason.MOVE_TO_LABEL,
                        label: statement.arg as string,
                    };
                }

                break;
            }
            case OpType.BACK_TO_LABEL: {
                return {
                    type: StepReturnReason.BACK_TO_LABEL,
                    label: statement.arg as string,
                };
            }
            case OpType.LITERAL:
            case OpType.LABEL:
            case OpType.RETURN:
            case OpType.ENTRY:
            case OpType.WHILE:
        }

        return returnSuccess;
    }

    protected stepCall(statement: ListStatement, stack: Stack3) {
        const { functionType, functionPointer } = statement.arg as StatementCallArg;
        // @TODO: use the type
        const fp = (functionPointer as ICallable);
        const args: IArgument[] = [];

        for (let argsRemain = fp.functionLength(); argsRemain; argsRemain--) {
            const currentArg = stack.pop();
            args.push({
                type: typeof currentArg,
                value: currentArg,
            });
        }

        const result = fp.callFunction(...args);

        // @todo: need to push undefined?
        stack.push(result);
    }

    protected stepComparison(opType: ComparisonOp) {
        // Args will pop's in reverse order
        const [rhs, lhs] = this.state.stack.popFew(2);

        switch (opType) {
            case ComparisonOp.LT: {
                this.state.stack.push(lhs < rhs);
                break;
            }
            case ComparisonOp.LE: {
                this.state.stack.push(lhs <= rhs);
                break;
            }
            case ComparisonOp.GT: {
                this.state.stack.push(lhs > rhs);
                break;
            }
            case ComparisonOp.GE: {
                this.state.stack.push(lhs >= rhs);
                break;
            }
            // @TODO: STRICT COMPARISON?
            case ComparisonOp.EQ: {
                this.state.stack.push(lhs === rhs);
                break;
            }
        }
    }

    protected stepIncrement() {
        let value = this.state.stack.pop();
        this.state.stack.push(value + 1);
    }

    protected stepArithmetic(operandsCount: number, mathOp: MathOp) {
        const operands = this.state.stack.popFew(operandsCount);

         // @TODO: How to control overflow?
         if (operandsCount == 2) {
            const simpleResult = this.performMathOperation(operands[0], operands[1], mathOp);
            this.state.stack.push(simpleResult);
            return;
        }

        const firstOperand = operands[0];

        const result = operands.slice(1).reduce((acc, next) => {
            return this.performMathOperation(acc, next, mathOp);
        }, firstOperand);

        this.state.stack.push(result);
    }

    /**
     * Perform math operation by op type
     */
    protected performMathOperation(prev: number, next: number, mathOp: MathOp) {
        switch (mathOp) {
            case MathOp.ADD: {
                return prev + next;
            }
            case MathOp.DIVIDE: { // @TODO: Int / float?
                if (next === 0) {
                    throw new MathException(MathErrorCodes.DIVISION_BY_ZERO);
                }
                return prev / next;
            }
            case MathOp.MULTIPLY: {
                return prev * next;
            }
            case MathOp.SUBTRACT: {
                return prev - next;
            }
            case MathOp.MODULO: {
                return prev % next;
            }
        }
    }
}

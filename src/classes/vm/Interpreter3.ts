import { ListStatement } from "../GraphProcessor";
import { IArgument, ICallable } from "./ICallable";
import { OpType } from "./Interpreter2";

export enum ComparisonOp {
    LT,
    LE,
    GT,
    GE,
    EQ
}

export enum MathOp {
    ADD,
    DIVIDE,
    MULTIPLY,
    SUBTRACT
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
        const tmp = this.stack.slice(0, (-count));
        this.stack.length -= count;

        return tmp;
    }
}

class LabelsHolder {
    protected statementsIndex: Map<string, number> = new Map();

    public set(label: string, statementIndex: number) {
        if (this.statementsIndex.has(label)) {
            throw new Error(`Stack already have label ${label}`);
        }

        this.statementsIndex.set(label, statementIndex);
    }

    public getIndexByLabel(label: string) {
        return this.statementsIndex.get(label);
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
    public readonly labels: LabelsHolder = new LabelsHolder();
    public readonly scope: Scope3 = new Scope3();
}

enum StepReturnReason {
    SUCCESS,
    MOVE_TO_LABEL,
}

type StepReturnValue = {
    type: StepReturnReason.MOVE_TO_LABEL,
    label: string,
} | {
    type: StepReturnReason.SUCCESS
};

const returnSuccess = {
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

    public continue() {
    loop:
        for (let i = this.statementCursor; i < this.statements.length; i++) {
            const result = this.step(this.statements[i], i, this.state);

            switch (result.type) {
                case StepReturnReason.MOVE_TO_LABEL: {
                    const index = this.state.labels.getIndexByLabel(result.label);

                    if (index === undefined) {
                        throw new Error(`Cannot find label ${result.label}`);
                    }

                    this.statementCursor = index;

                    continue loop;
                }
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
                const [ operandsCount, mathOp ] = statement.arg as any;
                this.stepArithmetic(operandsCount, mathOp);
                break;
            }
            case OpType.ASSIGN: {
                const [ varName, value ] = statement.arg as any;
                this.state.scope.assign(varName, value);
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
            case OpType.LE: {
                this.stepComparison(stack.pop(), stack.pop(), ComparisonOp.LE, stack);
                break;
            }

            case OpType.LT: {
                this.stepComparison(stack.pop(), stack.pop(), ComparisonOp.LT, stack);
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

            case OpType.GOTO:
            case OpType.PUSH: {
                stack.push(statement.arg);
                break;
            }
            case OpType.JUMP_IF_FALSE: {
                return {
                    type: StepReturnReason.MOVE_TO_LABEL,
                    label: statement.arg as string,
                };
            }
            case OpType.BACK_TO_LABEL: {
                return {
                    type: StepReturnReason.MOVE_TO_LABEL,
                    label: statement.arg as string,
                };
            }
            case OpType.LITERAL:
            case OpType.LABEL: {
                // @TODO:
                state.labels.set(statement.arg as string, statementIndex);
                break;
            }
            case OpType.RETURN:
            case OpType.ENTRY:
            case OpType.WHILE:
        }

        return returnSuccess;
    }

    protected stepCall(statement: ListStatement, stack: Stack3) {
        const { type, functionPointer } = statement.arg as any;
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
        stack.push(result);
    }

    protected stepComparison(lhs: number, rhs: number, opType: ComparisonOp, stack: Stack3) {
        switch (opType) {
            case ComparisonOp.LT: {
                stack.push(lhs < rhs);
                break;
            }
            case ComparisonOp.LE: {
                stack.push(lhs <= rhs);
                break;
            }
            case ComparisonOp.GT: {
                stack.push(lhs > rhs);
                break;
            }
            case ComparisonOp.GE: {
                stack.push(lhs >= rhs);
                break;
            }
            // @TODO: STRICT COMPARISON?
            case ComparisonOp.EQ: {
                stack.push(lhs === rhs);
                break;
            }
        }
    }

    protected stepIncrement() {
        let value = this.state.stack.pop();
        this.state.stack.push(++value);
    }

    protected stepArithmetic(operandsCount: number, mathOp: MathOp) {
        // Multiplication ops must have 1 as start value, another ops must have 0
        const startValue = Number(mathOp === MathOp.MULTIPLY || mathOp === MathOp.DIVIDE);

        // @TODO: How to control overflow?
        const result = this.state.stack.popFew(operandsCount).reduce((acc, next) => {
            switch (mathOp) {
                case MathOp.ADD: {
                    return acc + next;
                }
                case MathOp.DIVIDE: { // @TODO: Int / float?
                    return acc / next;
                }
                case MathOp.MULTIPLY: {
                    return acc * next;
                }
                case MathOp.SUBTRACT: {
                    return acc - next;
                }
            }
        }, startValue);

        this.state.stack.push(result);
    }
}

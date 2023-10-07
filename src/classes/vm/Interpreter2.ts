/*
 var a = 1;
 var b = 5;
 var c = calcAll(calcSome() + calcOne() + 2);

 while(a > 0 && a < 7) {
    if (b > 0) {
        b--
    } else {
        log(a + b);
        break;
    }
 }
 */
/*
 Command list representation

 ASSIGN a 1
 ASSIGN b 5

 // Then we go down to the ast and rise up with commands

LABEL while <- @TODO: WHAT TO DO WITH NESTED LABELS?
LOAD a <- Load value of a to stack
PUSH 0 <- push literal constant to stack
GT <- Call operator GT, which pop 2 items from stack and push bool as a result
LOAD a
PUSH 7
LT <- Pops 2 items and place a bool
AND <- Pops 2 boolean (boolean-like(?)) items and push their result onto stack
JUMP_IF_FALSE while_end
JUMP
*/

 interface CallStackOperations {
    get head(): StackFrame2
    pop(): Optional<StackFrame2>
    push(value: StackFrame2): void
 }

 interface InstructionsIterator {
    next(): boolean
    // Dig into the tree, and gets down
    dig(): Optional<Statement>
 }

 type Args = Optional<Statement[]>;

 class StackFrame2 implements InstructionsIterator  {
    protected readonly symbols = new Map<object, any>();

    // @TODO:
    public returnValue: Statement

    constructor(
        public readonly args: Args = void 0,
        public readonly statements: Optional<Statement[]> = undefined,
        public readonly returnToInstruction: Optional<Statement> = undefined,
        public readonly functionQualifiedName: string = 'Anonymous'
    ) {}

    public dig(): Optional<Statement> {
        return
    }

    public next(): boolean {
        return true
    }

    public setVariable(id: string, value: any) {
        // @TODO:
        this.symbols.set({ id }, value);
    }
 }

class CallStack2 implements CallStackOperations, InstructionsIterator {
    next(): boolean {
        // @TODO: Need pop?
        return this.head.next();
    }

    dig(): Optional<Statement> {
        // @TODO: right?
        return this.head.dig()
    }

    get head(): StackFrame2 {
        return this.frames[this.frames.length - 1];
    }

    protected readonly frames: StackFrame2[] = [];

    public pop() {
        return this.frames.pop();
    }

    public push(value: StackFrame2) {
        this.frames.push(value);
    }
}

abstract class Statement {
    abstract readonly opType: OpType;
    protected currentStatementIndex: number = 0
    protected statements: Statement[] = []

    public next(): boolean {
        this.currentStatementIndex++;

        return !!this.statements[this.currentStatementIndex];
    }

    public dig(): Optional<Statement> {
        let lookupObject: Statement = this;

        do {
            const statement = lookupObject.statements[lookupObject.currentStatementIndex];
            if (statement) {
                lookupObject = statement;
            }

            // No more leafs, and we successfully dig
            if (!statement && lookupObject !== this) {
                return lookupObject;
            }

        } while (lookupObject)

        return undefined;
    }
}

class While extends Statement {
    readonly opType: OpType = OpType.WHILE;
}

class Assign extends Statement {
    readonly opType: OpType = OpType.ASSIGN;
}

class Call extends Statement {
    readonly opType: OpType = OpType.CALL;

    /**
     * @TODO: function
     */
    protected func: any;

    public setFunction(func: any) {
        this.func = func;
    }

    public buildStackFrameFromFunction(
        returnToInstruction: Statement
    ): StackFrame2 {
        // TODO: How to collect args?
        return new StackFrame2(
            this.func.args,
            this.func.firstStatement,
            returnToInstruction,
            this.func.name
        );
    }
}

class Block extends Statement {
    readonly opType: OpType = OpType.BLOCK;
}

class Branch extends Statement {
    readonly opType: OpType = OpType.BLOCK;
}

class Literal extends Statement {
    readonly opType: OpType = OpType.LITERAL

    protected literalValue: any;

    public setValue(value: any) {
        this.literalValue = value;

        return this;
    }

    public getValue() {
        return this.literalValue;
    }
}

class Return extends Statement {
    readonly opType: OpType = OpType.RETURN;

    protected returnValue: any;

    public setReturnValue(value: any) {
        this.returnValue = value;
    }

    public getReturnValue() {
        return this.returnValue;
    }
}

// Special value, which handles entrypoint to the function
class Entry extends Statement {
    readonly opType: OpType = OpType.ENTRY;
}

export enum OpType {
    ARITHMETIC = 'ARITHMETIC',
    ASSIGN = 'ASSIGN',
    BLOCK = 'BLOCK',
    BRANCH = 'BRANCH',
    BREAK = 'BREAK',
    INC = 'INC',
    LE = 'LE',
    LT = 'LT',
    LOAD = 'LOAD',
    CALL = 'CALL',
    JUMP = 'JUMP',
    PUSH = 'PUSH',
    JUMP_IF_FALSE = 'JUMP_IF_FALSE',
    BACK_TO_LABEL = 'BACK_TO_LABEL',
    LITERAL = 'LITERAL',
    LABEL = 'LABEL',
    RETURN = 'RETURN',
    ENTRY = 'ENTRY',
    WHILE = 'WHILE',
}

export class Interpreter2 {
    public executeStack(stack: CallStack2) {
        let firstInstruction = stack.dig();

        if (!firstInstruction) {
            return
        }

        do {
            try {
                const currentInstruction = firstInstruction.dig();

                if (!currentInstruction) {
                    // @TODO: Which case?
                    continue;
                }

                switch (currentInstruction.opType) {
                    case OpType.ARITHMETIC:
                    case OpType.ASSIGN:
                    case OpType.BLOCK:
                    case OpType.BRANCH:
                    case OpType.BREAK:
                    case OpType.CALL:
                    case OpType.JUMP:
                    case OpType.RETURN: {
                        this.returnInstruction(stack, currentInstruction as Return);
                    }
                    case OpType.LITERAL: {
                        break;
                    }
                    case OpType.WHILE: {
                        this.whileInstruction(stack, currentInstruction as While);
                    }
                    case OpType.ENTRY: {

                    }
                }
            } catch (e) {

            }
        }
        while (firstInstruction.next())
    }

    protected whileInstruction(stack: CallStackOperations, instruction: While) {
        
    }

    protected branchInstruction() {

    }

    protected callInstruction(stack: CallStackOperations, currentInstruction: Call) {
        // const nextFrame = currentInstruction.buildStackFrameFromFunction();
    }

    protected returnInstruction(stack: CallStackOperations, currentInstruction: Return) {
        stack.head.returnValue = currentInstruction.getReturnValue();
    }
}

const firstFrame = new StackFrame2();
const stack2 = new CallStack2();

stack2.push(firstFrame);

const calcSome = new StackFrame2(undefined, undefined, undefined, 'calcSome');

stack2.push(calcSome);

firstFrame.setVariable('a', 1);
firstFrame.setVariable('b', 5);

// Then goes interest part:
// we have calcAll, but we have dependencies
/*
                   CALL
                   /   \
                calcAll firstInstruction
                 /
              firstArg
               +
              / \
             +   2
            / \
         CALL  CALL
          /     \
    calcSome    calcOne
*/
// calcAll is function with argument
// get down by the tree with argument
// argument is expression (here we have connected pin)(we have plus operator in dependency)
// get down
// first plus argument (has connected pin)(we have plus operator in dependency)
// get down

// PUSH calcSome to stack
// CALL calcSome
// SET returnValue on top of the stack (calcSome);

// PUSH calcOne to stack
// CALL calcOne
// SET returnValue on top of the stack (calcOne);

// HERE COMES OPERATOR "+", it wants 2 stack values
// POP calcOneResult
// POP calcSomeResult
// CALL +
// PUSH $plus_Result to stack

// we have right branch of parent "+" unexplored, do it
// PUSH LITERAL "2" TO STACK
// HERE COMES OPERATOR "+", it wants 2 stack values
// POP "2"
// POP previous "$plus_Result"
// PUSH current "$plus_Result"

// First argument calculated
// All arguments calculated
// CALL calcAll
// PUSH calcAll with args (top $plus_Result)
// SET returnValue on top of the stack (calcAll)

// for example calcAll returnValue will be "7"
firstFrame.setVariable('c', 7)



// HERE GOES While Operator

/*
                             while (label: while)
            (expr)  /                                 \ (stmt)
                   IF                                 IF
                  /  \                          /     |     \
                AND  GOTO (l: while)           >      --    BLOCK
                /  \                         /  \     |     /   \
               >    <                       b    0    b   CALL  GOTO (l: while)
              / \   / \                                  /
             a   0 a   7                               log
                                                       /
                                                    firstArg
                                                     /
                                                    +
                                                   / \
                                                  a   b
*/

/*
 THIS ^^ IS AST! We need to compile this in other representation.
 Current case is the command list

 At top of this file will be command list
*/

const interpreter2 = new Interpreter2();
interpreter2.executeStack(stack2)

const level3Statements: Statement[] = [
    new Entry(),
    new Literal().setValue(212),
    new Literal().setValue(9),
    new Literal().setValue(5),
    new Literal().setValue(212),
];
const stackLevel3 = new StackFrame2(undefined, level3Statements, undefined, 'entry');

const interpreterLevel3 = new Interpreter2();




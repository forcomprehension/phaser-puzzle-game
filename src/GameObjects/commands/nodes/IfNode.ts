import { NodePin } from "../NodePin";
import { PinPositionDescription } from "../pinPositionDescription";
import { CommandNode, InstructionType } from "./CommandNode";
import { NODE_RECEIVE_DATA } from "./events";

export class BranchNodeConnectedBranches {
    constructor(
        public readonly trueNode: Optional<CommandNode>,
        public readonly falseNode: Optional<CommandNode>
    ) {}
}

export class IfNode extends CommandNode {
    public static readonly ACTOR_KEY = 'IfNode';

    protected truePin: NodePin;
    protected falsePin: NodePin;

    protected conditionPin: NodePin;

    public readonly instructionType: InstructionType = InstructionType.BRANCH;

    protected init(): this {
        super.init();

        this.on(NODE_RECEIVE_DATA, (senderPin: NodePin, data: any, receiverPin: NodePin) => {
            if (senderPin.isFlow()) { // Assume that we have only flow pins here
                
            }
        });

        return this;
    }
    /**
     * @inheritdoc
     */
    protected getTextNode(): string {
        return 'IF';
    }

    /**
     * @inheritdoc
     */
    protected getLeftFlowPins(): NodePin[] {
        return [
            new NodePin(this.scene, PinPositionDescription.FLOW_LEFT_PIN),
        ];
    }

    protected getLeftPins(): NodePin[] {
        return [
            this.conditionPin = new NodePin(this.scene, PinPositionDescription.LEFT_PIN)
        ];
    }

    protected getRightFlowPins(): NodePin[] {
        return [
            this.truePin = new NodePin(this.scene, PinPositionDescription.FLOW_RIGHT_PIN),
            this.falsePin = new NodePin(this.scene, PinPositionDescription.FLOW_RIGHT_PIN),
        ]
    }

    public nextNode() {
        const value = false; // get value from left pin

        const nextNode = value ?
            this.truePin.getConnectedObject() :
            this.falsePin.getConnectedObject();

        if (nextNode instanceof NodePin) {
            return nextNode.parentContainer;
        } else {
            return undefined;
        }
    }

    /** region IGraphProcessorAgent **/
    public getConditionRule(): Optional<CommandNode> {
        const connectedObject = this.conditionPin.getConnectedObject();

        if (connectedObject instanceof NodePin) {
            return (connectedObject as NodePin).parentContainer;
        }
    }

    public getBranchesStruct() {
        const truePinObject = this.truePin.getConnectedObject();
        const falsePinObject = this.falsePin.getConnectedObject();

        let trueBranch: Optional<CommandNode>;
        if (truePinObject instanceof NodePin) {
            trueBranch = truePinObject.parentContainer;
        }

        let falseBranch: Optional<CommandNode>;
        if (falsePinObject instanceof NodePin) {
            falseBranch = falsePinObject.parentContainer;
        }

        return new BranchNodeConnectedBranches(trueBranch, falseBranch);
    }
    /** endregion IGraphProcessorAgent **/
}

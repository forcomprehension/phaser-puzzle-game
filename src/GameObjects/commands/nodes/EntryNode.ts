import { NodePin } from "../NodePin";
import { PinPositionDescription } from "../pinPositionDescription";
import { CommandNode } from "./CommandNode";

export class EntryNode extends CommandNode {
    protected getTextNode(): string {
        return 'Entry';
    }

    protected getRightFlowPins(): NodePin[] {
        return [
            new NodePin(this.scene, PinPositionDescription.FLOW_RIGHT_PIN)
        ];
    }
}

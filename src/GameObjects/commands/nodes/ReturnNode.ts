import { NodePin } from "../NodePin";
import { PinPositionDescription } from "../pinPositionDescription";
import { CommandNode } from "./CommandNode";

export class ReturnNode extends CommandNode {
    protected getTextNode(): string {
        return 'Return';
    }

    protected getLeftFlowPins(): NodePin[] {
        return [
            new NodePin(this.scene, PinPositionDescription.FLOW_LEFT_PIN)
        ];
    }
}

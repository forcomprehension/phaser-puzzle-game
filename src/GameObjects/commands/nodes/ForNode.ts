import { NodePin } from "../NodePin";
import { PinPositionDescription } from "../pinPositionDescription";
import { CommandNode } from "./CommandNode";

/**
 * For loop node
 */
export class ForNode extends CommandNode {
    protected getTextNode() {
        return 'FOR';
    }

    protected getLeftPins(): NodePin[] {
        return [];
    }

    protected getRightPins(): NodePin[] {
        return [
            // End Pin
            new NodePin(this.scene, PinPositionDescription.FLOW_LEFT_PIN),
            // Iteration Pin
            new NodePin(this.scene, PinPositionDescription.FLOW_LEFT_PIN),
        ];
    }
}

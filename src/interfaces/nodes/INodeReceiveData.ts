import { NodePin } from "@GameObjects/commands/NodePin";

/**
 * Interface for mark node which can receive data
 */
export interface INodeReceiveData {
    canReceiveData(): boolean;

    receiveData(otherPin: NodePin, data: any, myPin: NodePin): void;
}

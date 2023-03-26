import { BodyLabel } from "@src/constants/collision";

/**
 * Gameobject which connects other entities and handles connection data
 */
export interface IConnectorObject {
    getBodyLabel(): BodyLabel
    connectConnector(): void;
    disconnectConnector(): void;
    /** 
     * @TODO: which socket?
     */
    getSocketPosition(): Readonly<Vector2Like>;
}

import { BodyLabel } from "@src/constants/collision";

/**
 * Gameobject which connects other entities and handles connection data
 */
export interface IConnectedObject {
    /**
     * Get body label type
     */
    getBodyLabel(): BodyLabel

    /**
     * Get this socket world location
     */
    getSocketLocation(): Readonly<Vector2Like>;
}

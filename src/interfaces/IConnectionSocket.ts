import { IConnectorObject } from "./IConnectorObject";

/**
 * Interface which represents connection socket between two game objects
 */
export interface IConnectionSocket {
    getSocketLocation(): Vector2Like;
    getSocketIsBusy(): boolean;
    getConnectorObject(): IConnectorObject;
}

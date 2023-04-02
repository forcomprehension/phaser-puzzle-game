import { IConnectedObject } from "./IConnectedObject";

/**
 * Interface which represents connection socket between two game objects
 */
export interface IConnectionSocket {
    /**
     * Get world position of current socket
     */
    getSocketLocation(): Vector2Like;

    /**
     * Socket is busy?
     */
    getSocketIsBusy(): boolean;

    /**
     * Get socket connector component
     */
    getConnectorObject(): IConnectedObject;

     /**
     * Connect other object to this object's socket
     */
    connectObject(targetObject: IConnectedObject): void;

     /**
      * Disconnect other object from this object.
      */
    disconnectObject(targetObject: IConnectedObject): void;
}

import type { IConnectionSocket } from "@interfaces/IConnectionSocket";
import type { IConnectedObject } from "@interfaces/IConnectedObject";

export class GameObjectDuplexConnector {
    protected lhsObject: IConnectedObject;
    protected rhsObject: IConnectedObject;

    protected onDisconnect: Function;

    /**
     * Ctor
     *
     * @param lhsObject
     * @param rhsObject
     */
    constructor(
        lhsObject: IConnectionSocket,
        rhsObject: IConnectionSocket,
    ) {
        this.lhsObject = lhsObject.getConnectorObject();
        this.rhsObject = rhsObject.getConnectorObject();

        lhsObject.connectObject(this.rhsObject, false);
        rhsObject.connectObject(this.lhsObject, true);

        this.onDisconnect = () => {
            if (this.rhsObject && this.lhsObject) {
                lhsObject.disconnectObject(this.rhsObject);
                rhsObject.disconnectObject(this.lhsObject);
            }
        };
    }

    public getFirstConnector() {
        return this.lhsObject;
    }

    public getSecondConnector() {
        return this.rhsObject;
    }

    public disconnect() {
        this.onDisconnect();
        // @ts-ignore
        this.lhsObject = this.rhsObject = null;
    }
}

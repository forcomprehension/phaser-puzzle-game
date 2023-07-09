import type { IConnectionSocket } from "@interfaces/IConnectionSocket";
import type { IConnectedObject } from "@interfaces/IConnectedObject";
import { NodePin } from "@GameObjects/commands/NodePin";

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

        const { lhsObject: lhs, rhsObject: rhs } = this;
        let edgeId = '', rhsId = '', lhsId = '';
        if (
            lhs instanceof NodePin
            && rhs instanceof NodePin
            && lhs.isFlow() && rhs.isFlow() // @todo: this checking must be in upper
        ) {
            // Edge label name will be id of left
            edgeId = lhs.id;
            rhsId = rhs.id;
            lhsId = lhs.id;
            lhs.scene.frameGraph.connectNodes(lhsId, rhsId, edgeId);
        }

        this.onDisconnect = () => {
            if (edgeId) {
                (lhs as NodePin).scene.frameGraph.disconnectNodes(lhsId, rhsId, edgeId);
            }

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

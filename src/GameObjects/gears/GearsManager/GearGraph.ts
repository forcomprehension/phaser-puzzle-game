import { ROTATION_DIRECTION } from '@utils/types';
import { Graph } from 'graphlib'

/**
 * Graph key type
 */
export type GraphKey = string;

/**
 * Gear info
 */
export interface GearNode {
    isJammed: boolean,
    isMotor: boolean,
    direction: ROTATION_DIRECTION
};

/**
 * Edge data for gear graph
 */
export type GearGraphEdgeData = {
    isExternal: boolean
};

/**
 * Graph for gears control
 */
export class GearGraph extends Graph {
    /**
     * Indices for gears marked as motors
     */
    protected readonly motorIndex: Set<GraphKey> = new Set();

    /**
     * Ctor
     *
     * @param args
     */
    constructor() {
        super({ directed: true });

        this.setDefaultNodeLabel(() => {
            throw new Error('Cannot create node with empty label')
        });

        this.setDefaultEdgeLabel(() => {
            throw new Error('Cannot create edge with empty label')
        });
    }

    /**
     * Adds a gear to graph
     *
     * @param key
     * @param motorDirection
     */
    public addGear(key: GraphKey, gearNode: GearNode) {
        this.updateMotorsIndex(key, gearNode.isMotor);
        this.setNode(key, gearNode);
    }

    /**
     * Connects two gears
     *
     * @param lhs
     * @param rhs
     */
    public connectGears(lhs: GraphKey, rhs: GraphKey, isExternal: boolean) {
        this.setEdge(lhs, rhs, {
            isExternal,
        } as GearGraphEdgeData);
    }

    /**
     * Disconnect two gears
     *
     * @param lhs
     * @param rhs
     */
    public disconnectGears(lhs: GraphKey, rhs: GraphKey) {
        this.removeEdge(lhs, rhs);
    }

     /**
      * Disconnect gear from internal connectors
      *
      * @param gearId
      */
     public disconnectGearFromInternals(gearId: GraphKey) {
        const edges = this.nodeEdges(gearId);
        if (edges) {
            edges.forEach((edge) => {
                const { isExternal } = this.edge(edge) as GearGraphEdgeData;
                if (!isExternal) {
                    this.removeEdge(edge);
                }
            });
        }
     }

    /**
     * Removes gear from graph
     *
     * @param key
     */
    public removeGear(key: GraphKey) {
        this.updateMotorsIndex(key, false);
        this.removeNode(key);
    }

    /**
     * Toggle gear direction
     *
     * @param key
     * @param motorDirection
     */
    public toggleMotor(key: GraphKey, motorDirection?: ROTATION_DIRECTION) {
        const nodeData = this.getNodeData(key);

        if (nodeData) {
            const isMotor = Boolean(motorDirection) && motorDirection !== ROTATION_DIRECTION.IDLE;
            nodeData.isMotor = isMotor;
            nodeData.direction = motorDirection || ROTATION_DIRECTION.IDLE;

            this.updateMotorsIndex(key, isMotor);
        }
    }

    /**
     * Suitable node data getter
     *
     * @param key
     *
     * @returns
     */
    public getNodeData(key: GraphKey): GearNode {
      const nodeData = this.node(key);

      if (!nodeData) {
        throw new Error(`Cannot find gear node with key "${key}"`);
      }

      return nodeData;
    }

    /**
     * @returns a copy of current motors index
     */
    public getMotorsIndexCopy() {
        return new Set(this.motorIndex);
    }

    /**
     * Update motor index by key and flag
     *
     * @param key
     * @param isMotor
     *
     * @returns {boolean} isMotor
     */
    protected updateMotorsIndex(key: GraphKey, isMotor: boolean) {
        if (isMotor) {
            this.motorIndex.add(key);
        } else {
            this.motorIndex.delete(key);
        }

        return isMotor;
    }
}

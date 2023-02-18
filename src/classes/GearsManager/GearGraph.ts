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
 * Graph for gears control
 */
export class GearGraph extends Graph {
    protected readonly motorIndex: Set<GraphKey> = new Set();

    constructor(...args: any[]) {
        super(...args);

        this.setDefaultNodeLabel(() => ({
            isMotor: false,
            direction: ROTATION_DIRECTION.IDLE,
            isJammed: false,
        } as GearNode));
    }

    /**
     * Adds a gear to graph
     *
     * @param key
     * @param motorDirection 
     */
    public addGear(key: GraphKey, motorDirection?: ROTATION_DIRECTION) {
        const isMotor = Boolean(motorDirection) && motorDirection !== ROTATION_DIRECTION.IDLE;
        this.updateMotorsIndex(key, isMotor);

        const nodeData: GearNode = {
            isJammed: false,
            isMotor,
            direction: motorDirection || ROTATION_DIRECTION.IDLE,
        };

        this.setNode(key, nodeData);
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
            nodeData.isMotor = Boolean(motorDirection) && motorDirection !== ROTATION_DIRECTION.IDLE;
            nodeData.direction = motorDirection || ROTATION_DIRECTION.IDLE;

            this.updateMotorsIndex(key, nodeData.isMotor);
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

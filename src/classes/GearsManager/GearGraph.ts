import { Graph } from 'graphlib'
import { GEAR_ROTATION_DIRECTION, GearNode } from './gearTypes'

/**
 * Graph key type
 */
export type GraphKey = string;

/**
 * Graph for gears control
 */
export class GearGraph extends Graph {
    protected readonly motorIndex: Set<GraphKey> = new Set();

    constructor(...args: any[]) {
        super(...args);

        this.setDefaultNodeLabel(() => ({
            isMotor: false,
            direction: GEAR_ROTATION_DIRECTION.IDLE,
            isJammed: false,
        } as GearNode));
    }

    public addGear(key: GraphKey, motorDirection?: GEAR_ROTATION_DIRECTION) {
        const isMotor = Boolean(motorDirection);
        this.updateMotorsIndex(key, isMotor);

        const nodeData: GearNode = {
            isJammed: false,
            isMotor,
            direction: motorDirection || GEAR_ROTATION_DIRECTION.IDLE,
        };

        return this.setNode(key, nodeData);
    }

    public removeGear(key: GraphKey) {
        this.motorIndex.delete(key);
        this.removeNode(key);
    }

    public toggleMotor(key: GraphKey, motorDirection?: GEAR_ROTATION_DIRECTION) {
        const nodeData = this.getNodeData(key);

        if (nodeData) {
            nodeData.isMotor = Boolean(motorDirection);
            nodeData.direction = motorDirection || GEAR_ROTATION_DIRECTION.IDLE;
        }
    }

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

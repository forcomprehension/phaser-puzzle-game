import { Graph } from 'graphlib'
import { iterateOverEdges } from './iterateOverEdges';
import { checkMotorsRotationsAreCompatible } from './utils';

/**
 * Gear rotation type
 */
export enum GEAR_ROTATION_DIRECTION {
    IDLE = "IDLE",
    CW = "CW",
    CCW = "CCW"
}

/**
 * Gear info
 */
export interface GearNode {
    isJammed: false,
    isMotor: boolean,
    direction: GEAR_ROTATION_DIRECTION
};

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

    public updateGearsStates() {
        const localIndex = new Set(this.motorIndex);
        const visitedNodes = new Set<GraphKey>();
        for (const motorKey of localIndex) {
            iterateOverEdges(this, motorKey, ({ v, w }) => {
                const vVisited = visitedNodes.has(v);
                const wVisited = visitedNodes.has(w);

                const vData = this.getNodeData(v);
                const wData = this.getNodeData(w);

                const vIsMotor = vData.isMotor;
                const wIsMotor = wData.isMotor;

                if (vIsMotor && wIsMotor) { // Both motors - check jamming
                    // We assume that the gear is not blocked if it in idle state
                    if (!checkMotorsRotationsAreCompatible(vData, wData)) {

                    }
                }
            });
            // let previousNodeData: GearNode = this.getNodeData(motorKey);
            // alg.preorder(this, [motorKey]).forEach((key) => {
            //     if (key === motorKey) {
            //         return;
            //     }
            //     const nodeData = this.getNodeData(key);
            //     const neighbors = this.neighbors(key);
            //     if (neighbors) {
            //         for (let i = 0; i < neighbors.length; i++) {
            //             const neighborData = this.getNodeData(neighbors[i]);
            //             if (neighborData.direction) {

            //             }
            //         }
            //     }

                
            //     // Remove all other motors neighbors keys. Only disconnected branches must be iterated
            //     if (nodeData.isMotor && key !== motorKey) {
            //         localIndex.delete(key);
            //     }

            //     previousNodeData = nodeData;
            // });
          // console.log('=======>\n');
            // const neighbors = this.neighbors(key);
            // if (neighbors) {
            //     // Walk through neighbors
            //     for (let i = 0; i < neighbors.length; i++) {
            //         const neighborKey = neighbors[i];
            //         const nodeData = this.node(neighborKey);
            //         console.log(neighborKey);
            //         if (!nodeData) {
            //             throw new Error(`Cannot find gear node with key "${neighborKey}"`);
            //         }

            //         // Remove all other motors neighbors keys. Only disconnected branches must be iterated
            //         if (nodeData.isMotor) {
            //             localIndex.delete(neighborKey);
            //         }
            //     }
            // }
        }
    }

    public getNodeData(key: GraphKey): GearNode {
      const nodeData = this.node(key);

      if (!nodeData) {
        throw new Error(`Cannot find gear node with key "${key}"`);
      }

      return nodeData;
    }

    public mergeNode(key: GraphKey, merge: (data: GearNode) => GearNode): void {
        // @ts-ignore
        const node: GearNode = this._nodes[key];
        if (!node) {
            throw new Error(`Cannot find gear node with key "${key}"`);
        }

        // @ts-ignore
        this._nodes[key] = merge(node);
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

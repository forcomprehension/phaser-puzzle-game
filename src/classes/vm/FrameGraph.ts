import type { NodePin } from '@GameObjects/commands/NodePin';
import { Graph } from 'graphlib'

type NodeKey = string;
type NodeType = NodePin;

/**
 * Concrete stack frame graph
 */
export class FrameGraph extends Graph {
    /**
     * Ctor
     */
    constructor() {
        super({
            directed: true,
            multigraph: true,
        });

        this.setDefaultNodeLabel(() => {
            throw new Error('Cannot create node with empty label')
        });

        this.setDefaultEdgeLabel(() => {
            throw new Error('Cannot create edge with empty label')
        });
    }

    /**
     * Register node
     */
    public registerNode(key: NodeKey, node: NodeType) {
        this.setNode(key, node);
    }

    /**
     * Make a connection
     */
    public connectNodes(lhs: NodeKey, rhs: NodeKey, id: string) {
        this.setEdge(lhs, rhs, id);
    }

    /**
     * Breaks an $id connection
     */
    public disconnectNodes(lhs: NodeKey, rhs: NodeKey, id: string) {
        this.removeEdge(lhs, rhs, id);
    }

    /**
     * Suitable node data getter
     *
     * @param key
     *
     * @returns
     */
    public getNodeData(key: NodeKey): NodeType {
        const nodeData = this.node(key);

        if (!nodeData) {
          throw new Error(`Cannot find gear node with key "${key}"`);
        }

        return nodeData;
      }
}

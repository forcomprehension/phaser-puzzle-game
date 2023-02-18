import { GearNode } from "./gearTypes";
import { GraphKey, GearGraph } from './GearGraph'
import { iterateOverEdges } from './iterateOverEdges';
import { checkGearsRotationsAreCompatible, getOppositeDirection } from './utils';

export class GearStatesUpdater {
    protected readonly visitedNodes = new Set<GraphKey>();

    /**
     * Does current subgraph is jammed?
     *
     * Subgraph - is a chunk of graph, connected to one of motors
     */
    protected currentSubgraphIsJammed: boolean = false;

    /**
     * Ctor
     *
     * @param graph
     */
    constructor(protected readonly graph: GearGraph) {}

    /**
     * Update nodes states
     */
    public update() {
        // Gets a motors copy
        const motorsIndexCopy = this.graph.getMotorsIndexCopy();

        for (const motorKey of motorsIndexCopy) {
            // Reset visited nodes on each iteration.
            // Because we remove all connected motors, and we get few unconnected graphs
            this.visitedNodes.clear();
            this.currentSubgraphIsJammed = false;

            iterateOverEdges(this.graph, motorKey, ({ v, w }) => {
                // There is no situation, when nodes both nodes was visited
                const vVisited = this.visitedNodes.has(v);
                const wVisited = this.visitedNodes.has(w);

                const vData = this.graph.getNodeData(v);
                const wData = this.graph.getNodeData(w);

                const vIsMotor = vData.isMotor;
                const wIsMotor = wData.isMotor;

                if (this.currentSubgraphIsJammed) {
                    // All graph jammed - all jammed here
                    vData.isJammed = true;
                    wData.isJammed = true;
                } else {
                    if (vIsMotor && wIsMotor) { // Both motors - check jamming
                        // We assume that the gear is not blocked if it in idle state
                        if (!checkGearsRotationsAreCompatible(vData, wData)) {
                            this.markSubgraphAsJammed(vData, wData);

                            // Remove these motors
                            motorsIndexCopy.delete(v);
                            motorsIndexCopy.delete(w);
                        } // Do nothing.
                    } else if (vIsMotor) {
                        motorsIndexCopy.delete(v);

                        this.leadOneNodeByAnother(true, wVisited, vData, wData);
                    } else if (wIsMotor) {
                        motorsIndexCopy.delete(w);

                        this.leadOneNodeByAnother(false, vVisited, vData, wData);
                    } else if (vVisited) { // if left is visited
                        this.leadOneNodeByAnother(true, wVisited, vData, wData);
                    } else if (wVisited) { // if right is visited
                        this.leadOneNodeByAnother(false, wVisited, vData, wData);
                    }

                    if (!this.currentSubgraphIsJammed) {
                        // Unblock both, just in case, if current graph is not jammed
                        wData.isJammed = false;
                        wData.isJammed = false;
                    }
                }

                this.visitedNodes.add(v);
                this.visitedNodes.add(w);
            });
        }
    }

    /**
     * Marks current subgraph as jamming and set is jamming all already visited nodes
     *
     * @param currentV
     * @param currentW
     */
    protected markSubgraphAsJammed(currentV: GearNode, currentW: GearNode) {
        // Mark current subgraph
        this.currentSubgraphIsJammed = true;

        // All visited nodes will be jammed too
        this.visitedNodes.forEach((node) => {
            const nodeData = this.graph.getNodeData(node);
            nodeData.isJammed = true;
        });

        currentV.isJammed = true;
        currentW.isJammed = true;
    }

    /**
     * This check edge nodes for jamming, and lead right or left node by another.
     *
     * @param leftLead        Which data was leading. if false - it swaps leftData and rightDat
     * @param oppositeVisited Does opposite node visited. if (true) checkJamming else assignOppositeDirection
     * @param leftData        Data will vData or wData based on leftLead
     * @param rightData       Data will vData or wData based on leftLead
     */
    protected leadOneNodeByAnother(leftLead: boolean, oppositeVisited: boolean, leftData: GearNode, rightData: GearNode) {
        const vData = leftLead ? leftData : rightData;
        const wData = leftLead ? rightData : leftData;

        if (oppositeVisited) {
            if (!checkGearsRotationsAreCompatible(vData, wData)) {
                this.markSubgraphAsJammed(vData, wData);
            }
        } else {
            wData.direction = getOppositeDirection(vData);
        }
    }
}

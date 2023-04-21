import type { Edge, Graph } from 'graphlib'
import type { GraphKey } from './GearGraph'

const DEFAULT_EDGE_NAME = "\x00";
const EDGE_KEY_DELIM = "\x01";
const EXTERNAL_MARK_DELIM = "\x02";

/**
 * Generate consistent key from edge node pair (a<===>b equal to b<===>a)
 *
 * @param edge
 */
function edgeToKey(edge: Edge, isExternal: boolean) {
    let v = String(edge.v);
    let w = String(edge.w);
    const ext = String(isExternal);

    if (v > w) { // swap
        let tmp = v;
        v = w;
        w = tmp;
    }

    return v + EDGE_KEY_DELIM + w + DEFAULT_EDGE_NAME + ext + EXTERNAL_MARK_DELIM;
}

/**
 * Internal method
 *
 * @param parentKey
 */
function iterateOverEdgesCallback(
    graph: Graph,
    parent: GraphKey,
    visitedSet: Set<string>,
    iteratorBody: (edge: Edge) => void,
) {
    const edges = graph.nodeEdges(parent);
    if (edges) {
        edges.forEach((edge) => {
            const { isExternal } = graph.edge(edge);
            const edgeKey = edgeToKey(edge, Boolean(isExternal));
            if (visitedSet.has(edgeKey)) {
                return;
            }

            visitedSet.add(edgeKey);

            iteratorBody(edge);

            const nextParent = parent === edge.v ? edge.w : edge.v;
            iterateOverEdgesCallback(graph, nextParent, visitedSet, iteratorBody);
        });
    }
}

/**
 * Graph iterator by edges. The a<===>b and b<===>a edges are equivalently, unless they have different secondary marks
 *
 * @param graph         Current graph we will walk
 * @param parent        Starting node key
 * @param iteratorBody  Iterator body block
 */
export function iterateOverEdges(
    graph: Graph,
    parent: GraphKey,
    iteratorBody: (edge: Edge) => void,
) {
    const visitedSet = new Set<string>();
    iterateOverEdgesCallback(graph, parent, visitedSet, iteratorBody);
}

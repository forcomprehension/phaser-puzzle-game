import type { Edge, Graph } from 'graphlib'
import type { GraphKey } from '../GearGraph'

export const DEFAULT_EDGE_NAME = "\x00";
export const EDGE_KEY_DELIM = "\x01";

/**
 * Generate consistent key from edge node pair (a<===>b equal to b<===>a)
 *
 * @param edge
 */
function edgeToKey(edge: Edge) {
    let v = String(edge.v);
    let w = String(edge.w);

    if (v > w) { // swap
        let tmp = v;
        v = w;
        w = tmp;
    }

    return v + EDGE_KEY_DELIM + w + DEFAULT_EDGE_NAME;
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
            const edgeKey = edgeToKey(edge);
            if (visitedSet.has(edgeKey)) {
                return;
            }

            visitedSet.add(edgeKey);

            iteratorBody(edge);
            iterateOverEdgesCallback(graph, edge.w, visitedSet, iteratorBody);
        });
    }
}

/**
 * Graph iterator by edges. The a<===>b and b<===>a edges are equivalently.
 * There is no situation when we get same pair.
 *
 * @param graph
 * @param parent
 * @param iteratorBody
 * @param visitedSet
 */
export function iterateOverEdges(
    graph: Graph,
    parent: GraphKey,
    iteratorBody: (edge: Edge) => void,
) {
    const visitedSet = new Set<string>();
    iterateOverEdgesCallback(graph, parent, visitedSet, iteratorBody);
}

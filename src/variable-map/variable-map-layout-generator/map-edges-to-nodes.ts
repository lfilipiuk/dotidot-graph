import {Edge, Node} from "reactflow";

export function mapEdgesToNodes(
    nodes: Node[],
    edges: Edge[],
): {
    sourceTypesForNode: Record<string, Set<string>>;
    parentNodeIdForNode: Record<string, Set<string>>;
} {
    const sourceTypesForNode: Record<string, Set<string>> = {};
    const parentNodeIdForNode: Record<string, Set<string>> = {};

    edges.forEach((edge) => {
        if (!sourceTypesForNode[edge.target]) {
            sourceTypesForNode[edge.target] = new Set();
        }
        const sourceNode = nodes.find((node) => node.id === edge.source);
        if (sourceNode) {
            sourceTypesForNode[edge.target].add(sourceNode.data.__typename);
            parentNodeIdForNode[edge.target] =
                parentNodeIdForNode[edge.target] || new Set();
            parentNodeIdForNode[edge.target].add(edge.source);
        }
    });

    return {sourceTypesForNode, parentNodeIdForNode};
}
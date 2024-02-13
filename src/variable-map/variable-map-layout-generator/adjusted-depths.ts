import {Node} from "reactflow";

export function calculateAdjustedDepths(
    nodes: Node[],
    parentNodeIdForNode: Record<string, Set<string>>,
): Record<string, number> {
    const adjustedDepths: Record<string, number> = {};

    const calculateDepth = (node: Node) => {
        const parentIds = parentNodeIdForNode[node.id] || new Set();
        parentIds.forEach((parentId) => {
            const parent = nodes.find((n) => n.id === parentId);
            if (parent && parent.data.type === node.data.type) {
                const depth =
                    adjustedDepths[parent.id] !== undefined
                        ? adjustedDepths[parent.id] + 1
                        : 1;
                adjustedDepths[node.id] = Math.max(adjustedDepths[node.id] || 0, depth);
                calculateDepth(parent);
            }
        });
    };

    nodes.forEach((node) => calculateDepth(node));

    return adjustedDepths;
}
export function createEdge({source, target}: { source: string; target: string }) {
    return {
        id: `edge-${source}-${target}`,
        source: source,
        target: target,
        type: "default",
        arrowHeadType: "arrowclosed",
    };
}
import { NodeColorKey, nodeColors } from "@/graph/node-colors.ts";

export function createNode(data: any, uniqueId: string) {
  const typeName: NodeColorKey = data.__typename as NodeColorKey;
  const borderColor = nodeColors[typeName] || "defaultColor";

  const label = data.name || typeName || data.id.toString();

  return {
    id: uniqueId,
    type: "custom-node",
    data: {
      ...data,
      label: label,
      borderColor,
    },
    position: { x: 0, y: 0 },
  };
}

export function createEdge({
  source,
  target,
}: {
  source: string;
  target: string;
}) {
  return {
    id: `edge-${source}-${target}`,
    source: source,
    target: target,
    type: "default",
    arrowHeadType: "arrowclosed",
  };
}

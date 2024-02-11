export function createNode(data: any, uniqueId: string) {
  const typeName = data.__typename;
  const label = data.name || typeName || data.id.toString();

  return {
    id: uniqueId,
    type: "custom-node",
    data: {
      ...data,
      label: label,
    },
    // TODO: maybe not needed
    position: { x: 0, y: 0 },
    width: 200,
    height: 50,
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

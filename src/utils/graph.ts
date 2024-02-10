import dagre from "dagre";

export const DEFAULT_WIDTH = 172;
const DEFAULT_HEIGHT = 36;

export const getLayoutedNodes = (nodes: any[], edges: any[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: "LR",
    ranksep: 100,
    align: "UR",
  });

  nodes.forEach((node: any) => {
    dagreGraph.setNode(node.id, {
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node: any) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - DEFAULT_WIDTH / 2,
        //x: node.position.x,
        y: nodeWithPosition.y - DEFAULT_HEIGHT / 2,
      },
    };
  });
};

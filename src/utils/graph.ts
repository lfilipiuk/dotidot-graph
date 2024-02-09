import { DotiNode } from "../types/types.ts";
import dagre from "dagre";
import { sizes } from "../ui/constants/sizes.ts";

const DEFAULT_WIDTH = 172;
const DEFAULT_HEIGHT = 36;

export const getLayoutedDotiNodes = (dotiNodes: DotiNode[]): DotiNode[] => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: "LR" }); // 'LR' is Left to Right direction.

    dotiNodes.forEach((node: DotiNode) => {
        dagreGraph.setNode(node.id, { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });
    });

    // edges
    //     .filter(({ type }) => type === 'default') // Do not consider 'chain' edge.
    //     .forEach((edge) => {
    //         dagreGraph.setEdge(edge.source, edge.target);
    //     });

    dagre.layout(dagreGraph);

    return dotiNodes.map((node: DotiNode) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
          ...node,
          // 'x' is already set at this moment because of `getXYPosition` function.
          position: {
            ...node.position,
            x: nodeWithPosition.x - sizes.nodeMaxWidth / 2,
            y: nodeWithPosition.y - DEFAULT_HEIGHT / 2,
          },
        };
    });
};
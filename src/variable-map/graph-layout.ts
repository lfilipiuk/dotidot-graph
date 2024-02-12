import { Node, Edge } from "reactflow";
import { NodeType } from "@/variable-map/types";
import { deepCloneObject } from "@/lib/utils.ts";

interface BasketConfig {
  rules: (
    node: Node,
    sourceTypesForNode: Record<string, Set<string>>,
  ) => boolean;
  startY: number;
}

interface Baskets {
  [key: string]: {
    nodes: Node[];
    config: BasketConfig;
  };
}

//Initialize the baskets, set rules and Y position for each basket
function initializeBaskets(): Baskets {
  return {
    //Variables without a target go here
    dataFieldNoTarget: {
      nodes: [],
      config: {
        rules: (node, sourceTypesForNode) =>
          node.data.type === NodeType.Variable &&
          !(sourceTypesForNode[node.id]?.size > 0),
        startY: 0,
      },
    },
    //Additional sources go here
    additionalSource: {
      nodes: [],
      config: {
        rules: (node) => node.data.type === NodeType.AdditionalSource,
        startY: 100,
      },
    },
    //Variables with a target go here
    dataFieldWithTarget: {
      nodes: [],
      config: {
        rules: (node, sourceTypesForNode) =>
          node.data.type === NodeType.Variable &&
          sourceTypesForNode[node.id]?.size > 0,
        startY: 50,
      },
    },
    //Modifiers go here
    modifier: {
      nodes: [],
      config: {
        rules: (node) => node.data.type === NodeType.Modifier,
        startY: 150,
      },
    },
    //Campaign settings go here
    campaignSetting: {
      nodes: [],
      config: {
        rules: (node) => node.data.type === NodeType.Campaign,
        startY: 50,
      },
    },
    //Everything else goes here
    others: { nodes: [], config: { rules: () => true, startY: 0 } },
  };
}

function mapEdgesToNodes(
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

  return { sourceTypesForNode, parentNodeIdForNode };
}

function sortNodesIntoBaskets(
  nodes: Node[],
  baskets: Baskets,
  sourceTypesForNode: Record<string, Set<string>>,
): void {
  nodes.forEach((node) => {
    for (const basketKey in baskets) {
      const basket = baskets[basketKey];
      if (basket.config.rules(node, sourceTypesForNode)) {
        basket.nodes.push(node);
        break; //Each node can only be in one basket
      }
    }
  });
}

function calculateAdjustedDepths(
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

function applyWaterfallEffect(
  basket: Node[],
  startX: number,
  startY: number,
  adjustedDepths: Record<string, number>,
): number {
  basket.sort((a, b) => {
    const typeComparison = a.data.type.localeCompare(b.data.type);
    if (typeComparison !== 0) return typeComparison;

    return (adjustedDepths[a.id] || 0) - (adjustedDepths[b.id] || 0);
  });

  let currentY = startY;
  let maxDepth = 0;

  basket.forEach((node) => {
    const depth = adjustedDepths[node.id] || 0;
    maxDepth = Math.max(maxDepth, depth);
    const xModifier = node.data.__typename === "BaseAdtext" ? 100 : 250;
    node.position = { x: startX + depth * xModifier, y: currentY };
    currentY += 100; // Adjust this value if you need more space between nodes vertically
  });

  return maxDepth;
}

export function generateLayout(nodes: Node[], edges: Edge[]): Node[] {
  const nodesWithPositions = deepCloneObject(nodes);
  const { sourceTypesForNode, parentNodeIdForNode } = mapEdgesToNodes(
    nodesWithPositions,
    edges,
  );
  const baskets = initializeBaskets();
  sortNodesIntoBaskets(nodesWithPositions, baskets, sourceTypesForNode);
  const adjustedDepths = calculateAdjustedDepths(
    nodesWithPositions,
    parentNodeIdForNode,
  );

  let startX = 100;
  const basketSpacing = 20;

  Object.keys(baskets).forEach((basketKey) => {
    const basket = baskets[basketKey];
    const startY = basket.config.startY;

    const maxDepth = applyWaterfallEffect(
      basket.nodes,
      startX,
      startY,
      adjustedDepths,
    );

    startX += (maxDepth + 1) * 250 + basketSpacing;
  });

  return nodesWithPositions;
}

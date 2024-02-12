import { Node, Edge } from "reactflow";
import { NodeType } from "@/graph/types";
interface Baskets {
  dataFieldNoTarget: Node[];
  dataFieldWithTarget: Node[];
  additionalSource: Node[];
  modifier: Node[];
  campaignSetting: Node[];
  others: Node[];
}

export class GraphLayout {
  constructor(
    public nodes: Node[],
    public edges: Edge[],
  ) {
    this.nodes = this.deepClone(nodes);
    this.edges = this.deepClone(edges);
  }

  deepClone<T>(obj: T): T {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      console.error("Deep clone error:", error);
      return obj; // Return the original object if clone fails
    }
  }

  initializeBaskets(): Baskets {
    return {
      dataFieldNoTarget: [],
      additionalSource: [],
      dataFieldWithTarget: [],
      modifier: [],
      campaignSetting: [],
      others: [],
    };
  }

  mapEdgesToNodes(): {
    sourceTypesForNode: Record<string, Set<string>>;
    parentNodeIdForNode: Record<string, Set<string>>;
  } {
    const sourceTypesForNode: Record<string, Set<string>> = {};
    const parentNodeIdForNode: Record<string, Set<string>> = {};

    this.edges.forEach((edge) => {
      if (!sourceTypesForNode[edge.target]) {
        sourceTypesForNode[edge.target] = new Set();
      }
      const sourceNode = this.nodes.find((node) => node.id === edge.source);
      if (sourceNode) {
        sourceTypesForNode[edge.target].add(sourceNode.data.__typename);
        parentNodeIdForNode[edge.target] =
          parentNodeIdForNode[edge.target] || new Set();
        parentNodeIdForNode[edge.target].add(edge.source);
      }
    });

    return { sourceTypesForNode, parentNodeIdForNode };
  }

  sortNodesIntoBaskets(
    sourceTypesForNode: Record<string, Set<string>>,
  ): Baskets {
    const baskets = this.initializeBaskets();

    this.nodes.forEach((node) => {
      let targetBasket: keyof Baskets = "others";

      switch (node.data.type) {
        case NodeType.Variable:
          targetBasket = sourceTypesForNode[node.id]?.size
            ? "dataFieldWithTarget"
            : "dataFieldNoTarget";
          break;
        case NodeType.AdditionalSource:
          targetBasket = "additionalSource";
          break;
        case NodeType.Modifier:
          targetBasket = "modifier";
          break;
        case NodeType.Campaign:
          targetBasket = "campaignSetting";
          break;
        // Add other cases as necessary
      }

      baskets[targetBasket].push(node);
    });

    return baskets;
  }

  calculateAdjustedDepths(
    parentNodeIdForNode: Record<string, Set<string>>,
  ): Record<string, number> {
    const adjustedDepths: Record<string, number> = {};

    const calculateDepth = (node: Node, basketTypeName: string) => {
      const parentIds = parentNodeIdForNode[node.id] || new Set();
      parentIds.forEach((parentId) => {
        const parent = this.nodes.find((n) => n.id === parentId);
        if (parent && parent.data.__typename === basketTypeName) {
          const depth =
            adjustedDepths[parent.id] !== undefined
              ? adjustedDepths[parent.id] + 1
              : 1;
          adjustedDepths[node.id] = Math.max(
            adjustedDepths[node.id] || 0,
            depth,
          );
          calculateDepth(parent, basketTypeName);
        }
      });
    };

    this.nodes.forEach((node) => calculateDepth(node, node.data.__typename));

    return adjustedDepths;
  }

  applyWaterfallEffect(
    basket: Node[],
    startX: number,
    startY: number,
    adjustedDepths: Record<string, number>,
  ): number {
    let currentY = startY;
    let maxDepth = 0;

    basket.forEach((node) => {
      const depth = adjustedDepths[node.id] || 0;
      maxDepth = Math.max(maxDepth, depth);
      const xModifier = node.data.__typename === "BaseAdtext" ? 100 : 250;
      node.position = { x: startX + depth * xModifier, y: currentY };
      currentY += 100;
    });

    return maxDepth;
  }

  generateLayout(): Node[] {
    const { sourceTypesForNode, parentNodeIdForNode } = this.mapEdgesToNodes();
    const baskets = this.sortNodesIntoBaskets(sourceTypesForNode);
    const adjustedDepths = this.calculateAdjustedDepths(parentNodeIdForNode);

    let startX = 100;
    const startY = 50;
    const basketSpacing = 20;

    Object.keys(baskets).forEach((basketKey) => {
      const key = basketKey as keyof Baskets;
      const maxDepth = this.applyWaterfallEffect(
        baskets[key],
        startX,
        startY,
        adjustedDepths,
      );
      startX += (maxDepth + 1) * 250 + basketSpacing;
    });

    return this.nodes;
  }
}
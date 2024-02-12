export class GraphLayout {
  constructor(nodes, edges) {
    this.nodes = this.deepClone(nodes);
    this.edges = this.deepClone(edges);
  }

  // Simple deep clone method - consider replacing for complex objects
  deepClone(obj) {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      console.error("Deep clone error:", error);
      // Implement or replace with a more complex deep clone method if needed
      return null;
    }
  }

  // Include your existing functions here, possibly with some modifications
  // to make them methods of this class rather than standalone functions.

  initializeBaskets() {
    return {
      dataFieldNoTarget: [],
      additionalSource: [],
      dataFieldWithTarget: [],
      modifier: [],
      campaignSetting: [],
      others: [],
    };
  }

  mapEdgesToNodes() {
    let sourceTypesForNode = {};
    let parentNodeIdForNode = {};

    this.edges.forEach((edge) => {
      if (!sourceTypesForNode[edge.target]) {
        sourceTypesForNode[edge.target] = new Set();
      }
      let sourceNode = this.nodes.find((node) => node.id === edge.source);
      if (sourceNode) {
        sourceTypesForNode[edge.target].add(sourceNode.data.__typename);
        parentNodeIdForNode[edge.target] =
          parentNodeIdForNode[edge.target] || new Set();
        parentNodeIdForNode[edge.target].add(edge.source);
      }
    });

    return { sourceTypesForNode, parentNodeIdForNode };
  }

  sortNodesIntoBaskets(sourceTypesForNode) {
    let baskets = this.initializeBaskets();

    this.nodes.forEach((node) => {
      let type = node.data.__typename;
      let id = node.data.id;
      let targetBasket = "others";

      if (type === "DataSourceVariable" && id.includes("Data")) {
        targetBasket = sourceTypesForNode[node.id]
          ? "dataFieldWithTarget"
          : "dataFieldNoTarget";
      } else if (type === "AdditionalSource") {
        targetBasket = "additionalSource";
      } else if (type === "DataSourceVariable" && id.includes("Modifier")) {
        targetBasket = "modifier";
      } else if (type === "CampaignSetting") {
        targetBasket = "campaignSetting";
      }

      baskets[targetBasket].push(node);
    });

    return baskets;
  }

  calculateAdjustedDepths(parentNodeIdForNode) {
    let adjustedDepths = {};

    const calculateDepth = (node, basketTypeName) => {
      let parentIds = parentNodeIdForNode[node.id] || [];
      parentIds.forEach((parentId) => {
        let parent = this.nodes.find((n) => n.id === parentId);
        if (parent && parent.data.__typename === basketTypeName) {
          let depth =
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

  applyWaterfallEffect(basket, startX, startY, adjustedDepths) {
    let currentY = startY;
    let maxDepth = 0;

    basket.forEach((node) => {
      let depth = adjustedDepths[node.id] || 0;
      maxDepth = Math.max(maxDepth, depth);
      const xModifier = node.data.__typename === "BaseAdtext" ? 100 : 250;
      node.position = { x: startX + depth * xModifier, y: currentY };
      currentY += 100;
    });

    return maxDepth;
  }

  generateLayout() {
    let { sourceTypesForNode, parentNodeIdForNode } = this.mapEdgesToNodes();
    let baskets = this.sortNodesIntoBaskets(sourceTypesForNode);
    let adjustedDepths = this.calculateAdjustedDepths(parentNodeIdForNode);

    let startX = 100;
    let startY = 50;
    let basketSpacing = 20;

    Object.keys(baskets).forEach((basketKey) => {
      let maxDepth = this.applyWaterfallEffect(
        baskets[basketKey],
        startX,
        startY,
        adjustedDepths,
      );
      startX += (maxDepth + 1) * 250 + basketSpacing;
    });

    return this.nodes;
  }
}

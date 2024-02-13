import {Edge, Node} from "reactflow";
import {initializeBaskets} from "@/variable-map/variable-map-layout-generator/initialize-baskets.ts";
import {deepCloneObject} from "@/lib/utils.ts";
import {sortNodesIntoBaskets} from "@/variable-map/variable-map-layout-generator/sort-nodes-into-baskets.ts";
import {mapEdgesToNodes} from "@/variable-map/variable-map-layout-generator/map-edges-to-nodes.ts";
import {calculateAdjustedDepths} from "@/variable-map/variable-map-layout-generator/adjusted-depths.ts";
import {applyWaterfallEffect} from "@/variable-map/variable-map-layout-generator/apply-waterfall-effect.ts";

const START_X = 100;
const BASKET_SPACING = 20;

export function generateLayout(nodes: Node[], edges: Edge[]): Node[] {
    const baskets = initializeBaskets();
    const nodesWithPositions = deepCloneObject(nodes);
    const {sourceTypesForNode, parentNodeIdForNode} = mapEdgesToNodes(
        nodesWithPositions,
        edges,
    );
    sortNodesIntoBaskets(nodesWithPositions, baskets, sourceTypesForNode);

    const adjustedDepths = calculateAdjustedDepths(
        nodesWithPositions,
        parentNodeIdForNode,
    );

    let startX = START_X;
    const basketSpacing = BASKET_SPACING;

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
import {Node} from "reactflow";
import {Baskets} from "@/variable-map/types/types.ts";

export function sortNodesIntoBaskets(
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
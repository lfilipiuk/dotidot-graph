import {DotiNode} from "../types/types.ts";
import jsonData from '../data/mockData.json';
import {getLayoutedNodes} from "../utils/graph.ts";
import {processAllCollections} from "@/graph/processor.ts";

export const convertJson = () => {
    const { nodes, edges }: any = processAllCollections(jsonData);
    const layoutedNodes: DotiNode[] = getLayoutedNodes(nodes, edges);

    return { nodes: layoutedNodes, edges };
};
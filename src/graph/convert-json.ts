import {DotiNode} from "../types/types.ts";
import jsonData from '../data/mockData.json';
import {getLayoutedDotiNodes} from "../utils/graph.ts";
import {findNodesAndEdgesInData} from "@/graph/graph-builder.ts";

export const convertJson = () => {
    const { nodes, edges }: any = findNodesAndEdgesInData(jsonData);
    const layoutedDotiNodes: DotiNode[] = getLayoutedDotiNodes(nodes, edges);
    //const dotiNodeEntities: Entities<DotiNode> = arrayToEntities<DotiNode>(layoutedDotiNodes, 'id');

    return { nodes: layoutedDotiNodes, edges };
};
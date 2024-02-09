import {DotiNode} from "../types/types.ts";
import jsonData from '../data/mockData.json';
import {findNodesInData} from "./data-traversal.ts";
import {getLayoutedDotiNodes} from "../utils/graph.ts";

export const convertJson = () => {
    const nodes : DotiNode[] = findNodesInData(jsonData);
    const layoutedSeaNodes: DotiNode[] = getLayoutedDotiNodes(nodes);
    //const seaNodeEntities: Entities<SeaNode> = arrayToEntities<SeaNode>(layoutedSeaNodes, 'id');

    return { nodes: layoutedSeaNodes };
};
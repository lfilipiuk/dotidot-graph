import jsonData from '../data/mockData.json';
import {processAllCollections} from "@/graph/processor.ts";
import {generateLayout} from "@/graph/generate-layout.ts";
import {getLayoutedNodes} from "@/utils/graph.ts";

export const convertJson = () => {
    const { nodes, edges }: any = processAllCollections(jsonData);

    console.log(nodes);

    const layoutedNodes: any = getLayoutedNodes(nodes, edges);
    //const layoutedNodes: any = generateLayout(nodes, edges);

    return { nodes: layoutedNodes, edges };
};
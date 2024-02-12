import jsonData from "../data/mockData.json";
import { processAllCollections } from "@/graph/processor.ts";
import { GraphLayout } from "./graph-layout.ts";

export const convertJson = () => {
  const { nodes, edges } = processAllCollections(jsonData);

  const graphLayout = new GraphLayout(nodes, edges);
  const layoutedNodes = graphLayout.generateLayout();

  return { nodes: layoutedNodes, edges };
};

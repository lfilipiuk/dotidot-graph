import {DotiNode, FeedExportNode, FeedExportNodeData} from "../types/types.ts";
import { createNode } from "./node-factory.ts";

export function findNodesInData(jsonData: any) {
  let nodes: DotiNode[] = [];
  // Traverse jsonData to find nodes, for example:
  jsonData.data.feedExports.feedExports.forEach((feedExport: FeedExportNodeData) => {
    nodes = nodes.concat(<FeedExportNode>createNode(feedExport),);
  });
  // Repeat for other node types

  console.log("nodes", nodes);

  return nodes.filter((node) => node !== null);
}

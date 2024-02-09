import {
  FeedExportNode,
  FeedExportNodeData,
  VariableNode,
  VariableNodeData,
} from "../types/types.ts";

export function createVariableNode(data: VariableNodeData): VariableNode {
  // Implement logic based on `data.id` and `data.__typename`
  const variableType = data.id.includes("DataField") ? "DataField" : "Modifier";
  return {
    id: data.id,
    data: {
      ...data,
      variableType,
    },
    position: { x: Math.random() * 400, y: Math.random() * 400 }, // Example position
  };
}

export function createFeedExportNode(data: FeedExportNodeData): FeedExportNode {
    return {
        id: data.id.toString(),
        data: {
            ...data,
            label: data.name,
        },
        position: {x: Math.random() * 400, y: Math.random() * 400}, // Example position
    }
}
import {
  FeedExportNode,
  FeedExportNodeData,
  VariableNode,
  VariableNodeData,
} from "../types/types.ts";

export function createVariableNode(data: VariableNodeData): VariableNode {
  const variableType = data.id.includes("DataField") ? "DataField" : "Modifier";
  return {
    id: data.id,
    data: {
      ...data,
      variableType,
      borderColor: variableType === "DataField" ? "blue" : "green",
    },
    position: { x: 0, y: 0 },
  };
}

export function createFeedExportNode(data: FeedExportNodeData): FeedExportNode {
  return {
    id: data.id.toString(),
    type: "custom-node",
    data: {
      ...data,
      label: data.name,
      borderColor: "pink",
    },
    position: { x: 0, y: 0 },
  };
}

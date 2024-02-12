import { Node } from "reactflow";
import { Entity, NodeType } from "@/graph/types.ts";

export function createNode(entity: Entity, uniqueId: string): Node {
  const typeName = entity.__typename;
  const label = entity.name || typeName || entity.id.toString();
  const type = getNodeType(entity);

  return {
    id: uniqueId,
    type: "custom-node",
    data: {
      ...entity,
      label: label,
      type: type,
    },
    position: { x: 0, y: 0 },
    width: 200,
    height: 50,
  };
}

export function createEdge({
  source,
  target,
}: {
  source: string;
  target: string;
}) {
  return {
    id: `edge-${source}-${target}`,
    source: source,
    target: target,
    type: "default",
    arrowHeadType: "arrowclosed",
  };
}

const getNodeType = (data: Entity): NodeType => {
  if (
    data.__typename === "DataSourceVariable" &&
    data.id.toString().includes("DataField")
  ) {
    return NodeType.Variable;
  } else if (
    data.__typename === "DataSourceVariable" &&
    data.id.toString().includes("Modifier")
  ) {
    return NodeType.Modifier;
  } else if (data.__typename === "AdditionalSource") {
    return NodeType.AdditionalSource;
  } else if (data.__typename === "CampaignSetting") {
    return NodeType.Campaign;
  } else if (data.__typename === "FeedExport") {
    return NodeType.FeedExport;
  } else if (data.__typename === "KeywordSetting") {
    return NodeType.KeywordSetting;
  } else if (data.__typename === "AdwordsSetting") {
    return NodeType.AdwordsSetting;
  } else if (data.__typename === "BaseAdtext") {
    return NodeType.BaseAdtext;
  } else if (data.__typename === "BidRule") {
    return NodeType.BidRule;
  }
  return NodeType.Default;
};

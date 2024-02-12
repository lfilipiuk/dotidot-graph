import { Node } from "reactflow";
import { Entity } from "@/variable-map/types.ts";
import { EntityType, NodeType } from "@/variable-map/enums.ts";

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
    data.__typename === EntityType.DataSourceVariable &&
    data.id.toString().includes("DataField")
  ) {
    return NodeType.Variable;
  } else if (
    data.__typename === EntityType.DataSourceVariable &&
    data.id.toString().includes("Modifier")
  ) {
    return NodeType.Modifier;
  } else if (data.__typename === EntityType.AdditionalSource) {
    return NodeType.AdditionalSource;
  } else if (data.__typename === EntityType.CampaignSetting) {
    return NodeType.Campaign;
  } else if (data.__typename === EntityType.FeedExport) {
    return NodeType.FeedExport;
  } else if (data.__typename === EntityType.KeywordSetting) {
    return NodeType.KeywordSetting;
  } else if (data.__typename === EntityType.AdwordsSetting) {
    return NodeType.AdwordsSetting;
  } else if (data.__typename === EntityType.BaseAdtext) {
    return NodeType.BaseAdtext;
  } else if (data.__typename === EntityType.BidRule) {
    return NodeType.BidRule;
  }
  return NodeType.Default;
};
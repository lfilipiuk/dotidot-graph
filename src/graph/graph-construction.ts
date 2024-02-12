export interface CustomNodeData {
  __typename: string;
  id: string;
  label: string;
  type: NodeType;
  showValueType?: "text" | "number" | "date" | "array" | "image";
}

export enum NodeType {
  Variable = "variable",
  Modifier = "modifier",
  AdditionalSource = "additional-source",
  Campaign = "campaign",
  FeedExport = "feed-export",
  KeywordSetting = "keyword-setting",
  AdwordsSetting = "adwords-setting",
  BaseAdtext = "base-adtext",
  BidRule = "bid-rule",
  Default = "default",
}

export function createNode(data: any, uniqueId: string) {
  const typeName = data.__typename;
  const label = data.name || typeName || data.id.toString();
  const type = getNodeType(data);

  return {
    id: uniqueId,
    type: "custom-node",
    data: {
      ...data,
      label: label,
      type: type,
    },
    // TODO: maybe not needed
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

const getNodeType = (data: CustomNodeData): NodeType => {
  if (
    data.__typename === "DataSourceVariable" &&
    data.id.includes("DataField")
  ) {
    return NodeType.Variable;
  } else if (
    data.__typename === "DataSourceVariable" &&
    data.id.includes("Modifier")
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

import { Entity } from "@/variable-map/types/types.ts";
import { EntityType, NodeType } from "@/variable-map/types/enums.ts";

export const getNodeType = (data: Entity): NodeType => {
  // Handle the special cases for DataSourceVariable with specific id patterns
  if (data.__typename === EntityType.DataSourceVariable) {
    if (data.id.toString().includes("DataField")) {
      return NodeType.Variable;
    } else if (data.id.toString().includes("Modifier")) {
      return NodeType.Modifier;
    }
  }

  switch (data.__typename) {
    case EntityType.AdditionalSource:
      return NodeType.AdditionalSource;
    case EntityType.CampaignSetting:
      return NodeType.Campaign;
    case EntityType.FeedExport:
      return NodeType.FeedExport;
    case EntityType.KeywordSetting:
      return NodeType.KeywordSetting;
    case EntityType.AdwordsSetting:
      return NodeType.AdwordsSetting;
    case EntityType.BaseAdtext:
      return NodeType.BaseAdtext;
    case EntityType.BidRule:
      return NodeType.BidRule;
    default:
      return NodeType.Default;
  }
};

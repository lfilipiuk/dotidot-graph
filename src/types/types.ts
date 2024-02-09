import { Node } from "reactflow";

type SharedNodeData = {
  id: string;
  label: string;
  borderColor: string;
  __typename: string;
};

export type FeedExportNodeData = SharedNodeData & {
  icon: string;
  name: string;
  getPlaceholdersWithoutConditions: string[];
  getConditionsPlaceholders: string[];
  __typename: "FeedExport";
};

export type AdditionalSourceNodeData = SharedNodeData & {
  icon: string;
  mappingField: string;
  mappingFields: string[];
  __typename: "AdditionalSource";
};

export type CampaignSettingNodeData = SharedNodeData & {
  icon: string;
  getPlaceholdersWithoutConditions: string[];
  getConditionsPlaceholders: string[];
  adwordsSetting?: AdwordsSettingNode;
  keywordSettings?: KeywordSettingNode[];
  baseAdtexts?: BaseAdTextNode[];
  bidRules?: BidRuleNode[];
  __typename: "CampaignSetting";
};

export type AdwordsSettingNodeData = SharedNodeData & {
  getPlaceholdersWithoutConditions: string[];
  __typename: "AdwordsSetting";
};

export type KeywordSettingNodeData = SharedNodeData & {
  getPlaceholdersWithoutConditions: string[];
  getConditionsPlaceholders: string[];
  __typename: "KeywordSetting";
};

export type BaseAdTextNodeData = SharedNodeData & {
  parentAdTextId?: string;
  childAdTexts?: BaseAdTextNode[];
  __typename: "BaseAdText";
};

export type BidRuleNodeData = SharedNodeData & {
  __typename: "BidRule";
};

export type VariableNodeData = SharedNodeData & {
  variableType: "DataField" | "Modifier";
  __typename: "DataSourceVariable";
};

export type FeedExportNode = Node<FeedExportNodeData>;
export type AdditionalSourceNode = Node<AdditionalSourceNodeData, "object">;
export type CampaignSettingNode = Node<CampaignSettingNodeData, "object">;
export type AdwordsSettingNode = Node<AdwordsSettingNodeData, "object">;
export type KeywordSettingNode = Node<KeywordSettingNodeData, "object">;
export type BaseAdTextNode = Node<BaseAdTextNodeData, "object">;
export type BidRuleNode = Node<BidRuleNodeData, "object">;
export type VariableNode = Node<VariableNodeData, "object">;

export type DotiNode =
  | FeedExportNode
  | AdditionalSourceNode
  | CampaignSettingNode
  | AdwordsSettingNode
  | KeywordSettingNode
  | BaseAdTextNode
  | BidRuleNode
  | VariableNode;

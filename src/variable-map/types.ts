export interface JsonData {
  data: EntityCollection;
}
export interface EntityCollection {
  feedExports?: CollectionWithEntities;
  additionalSources?: CollectionWithEntities;
  campaignSettings?: CollectionWithEntities;
  variables?: CollectionWithEntities;
}

interface CollectionWithEntities {
  __typename: string;
  feedExports?: Entity[];
  additionalSources?: Entity[];
  campaignSettings?: Entity[];
  variables?: Entity[];
}

export interface Entity {
  __typename: string;
  id: string | number;
  parentId?: string | number;
  mappingField?: string;
  placeholderName?: string;
  getPlaceholdersWithoutConditions?: string[];
  getConditionsPlaceholders?: string[];
  imageGen?: {
    getPlaceholdersWithoutConditions: string[];
    getConditionsPlaceholders: string[];
  } | null;
  [key: string]: unknown;
}

export type ProcessedIds = Set<string>;

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

export interface ColorProps {
  border: string;
  background: string;
}

export enum VariableType {
  Number = "number",
  Text = "text",
  Date = "date",
  Array = "array",
  Image = "image",
}

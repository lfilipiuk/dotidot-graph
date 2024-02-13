import {Node} from "reactflow";

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

export interface BasketConfig {
  rules: (
      node: Node,
      sourceTypesForNode: Record<string, Set<string>>,
  ) => boolean;
  startY: number;
}

export interface Baskets {
  [key: string]: {
    nodes: Node[];
    config: BasketConfig;
  };
}

export type ProcessedIds = Set<string>;
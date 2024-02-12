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

export interface ColorProps {
  border: string;
  background: string;
}
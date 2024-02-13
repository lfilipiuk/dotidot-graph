import {
  EntityCollectionName,
  EntitySpecificProperty,
} from "@/variable-map/types/enums.ts";

export interface EntitiesToCreate {
    entitySpecificProperties: {
        [key: string]: EntitySpecificProperty[];
    };
    collections: EntityCollectionName[] | string[];
}

export const entitiesToCreate = {
  entitySpecificProperties: {
    CampaignSetting: [
      EntitySpecificProperty.BidRules,
      EntitySpecificProperty.BaseAdtexts,
      EntitySpecificProperty.KeywordSettings,
      EntitySpecificProperty.AdwordsSetting,
    ],
    DataSourceVariable: [EntitySpecificProperty.AdditionalSource],
    FeedExport: [],
    AdditionalSource: [],
  },
  collections: [
    EntityCollectionName.Variables,
    EntityCollectionName.FeedExports,
    EntityCollectionName.AdditionalSources,
    EntityCollectionName.CampaignSettings,
  ],
} as EntitiesToCreate;

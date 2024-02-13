import {
  EntityCollectionName,
  EntitySpecificProperty,
} from "@/variable-map/types/enums.ts";

export interface EntitiesToCreate {
  entitySpecificProperties: { [key: string]: string[] }; //Properties to loop through within each entity
  collections: string[]; //Collections to loop through
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
};

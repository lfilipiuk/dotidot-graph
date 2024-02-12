export const entityConfig = {
  entitySpecificProperties: {
    CampaignSetting: [
      "bidRules",
      "baseAdtexts",
      "keywordSettings",
      "adwordsSetting",
    ],
    DataSourceVariable: ["additionalSource"],
    FeedExport: [],
    AdditionalSource: [],
  } as { [key: string]: string[] },
  collections: [
    "variables",
    "feedExports",
    "additionalSources",
    "campaignSettings",
  ],
};

import { ColorProps, NodeType } from "@/variable-map/types.ts";

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

export const colorMapping: Record<NodeType, ColorProps> = {
  [NodeType.Variable]: { border: "#1E90FF", background: "#AFEEEE" },
  [NodeType.Modifier]: { border: "#32CD32", background: "#98FB98" },
  [NodeType.AdditionalSource]: { border: "#FFD700", background: "#FFFACD" },
  [NodeType.Campaign]: { border: "#FF4500", background: "#FFA07A" },
  [NodeType.FeedExport]: { border: "#DB7093", background: "#FFC0CB" },
  [NodeType.KeywordSetting]: { border: "#6A5ACD", background: "#E6E6FA" },
  [NodeType.AdwordsSetting]: { border: "#20B2AA", background: "#AFEEEE" },
  [NodeType.BaseAdtext]: { border: "#BDB76B", background: "#F5F5DC" },
  [NodeType.BidRule]: { border: "#9b15c7", background: "#e7b6ff" },
  [NodeType.Default]: { border: "#808080", background: "#D3D3D3" },
};

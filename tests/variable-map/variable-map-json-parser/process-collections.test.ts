import { describe, it, expect } from "vitest";
import mockData from "../../../tests/data/mockData.json";
import { processCollections } from "../../../src/variable-map/variable-map-json-parser/process-collections";
import {
  EntityCollectionName,
  EntitySpecificProperty,
} from "../../../src/variable-map/types/enums";

describe("processCollections", () => {
  it("should correctly process entities and return nodes and edges", () => {
    const entitiesToCreate = {
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

    const result = processCollections(mockData, entitiesToCreate);
    expect(result.nodes).toHaveLength(33);
    expect(result.edges).toHaveLength(63);
  });
});

describe("processCollections", () => {
  it("should correctly process entities and return nodes and edges, but loop only through specified collections", () => {
    const entitiesToCreate = {
      entitySpecificProperties: {
        DataSourceVariable: [EntitySpecificProperty.AdditionalSource],
        FeedExport: [],
        AdditionalSource: [],
      },
      collections: [
        EntityCollectionName.Variables,
        EntityCollectionName.FeedExports,
        EntityCollectionName.AdditionalSources,
      ],
    };

    const result = processCollections(mockData, entitiesToCreate);
    expect(result.nodes).toHaveLength(24);
    expect(result.edges).toHaveLength(32);
  });
});

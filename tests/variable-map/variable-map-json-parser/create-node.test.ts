import { describe, it, expect, vi } from "vitest";
import { createNode } from "../../../src/variable-map/variable-map-json-parser/create-node";

vi.mock("@/variable-map/variable-map-json-parser/get-node-type.ts", () => ({
  getNodeType: vi.fn(() => "mocked-type"),
}));

describe("createNode", () => {
  it("creates a node with correct structure and data from an entity", () => {
    const entity = {
      id: 20,
      name: "asdas",
      getPlaceholdersWithoutConditions: ["brand", "nazev_bez_brandu"],
      getConditionsPlaceholders: [],
      __typename: "KeywordSetting",
    };
    const uniqueId = "unique-123";
    const expectedNode = {
      id: uniqueId,
      type: "custom-node",
      data: {
        ...entity,
        label: "asdas",
        type: "mocked-type",
      },
      position: { x: 0, y: 0 },
      width: 200,
      height: 50,
    };

    const node = createNode(entity, uniqueId);

    expect(node).toEqual(expectedNode);
  });
});

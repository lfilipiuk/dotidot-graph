import { describe, it, expect, vi , beforeEach} from "vitest";
import * as VirtualMocks from "../mocks/virtualMocks";

// Correctly mock your module
vi.mock('../../src/variable-map/variable-map-json-parser', async (importOriginal) => {
  // Use `importOriginal` to get the actual module
  const originalModule = await importOriginal();

  // Return an object that includes both the actual and mocked implementations
  return {
    createNode: VirtualMocks.createNodeMock, // Provide your mock implementation
  };
});

// Setup your mock implementation
beforeEach(() => {
  VirtualMocks.createNodeMock.mockImplementation(() => ({ id: "node-1", type: "NodeType", name: "NodeName" }));
});

const entity = {
  id: "gid://ppcbee-controll/Modifier/87",
  name: "upraveny nazev",
  placeholderName: "upraveny_nazev",
  showValueType: "text",
  getPlaceholdersWithoutConditions: ["product_name"],
  getConditionsPlaceholders: [],
  imageGen: null,
  additionalSource: null,
  __typename: "DataSourceVariable",
};

describe("processEntity", () => {
  it("should process an entity and update nodes and edges correctly", async () => {
    const { processEntity } = await import('../../src/variable-map/variable-map-json-parser');
    const nestedEntityId = null;
    const nodes: never[] = [];
    const edges: never[] = [];
    const processedIds = new Set<string>();

    processEntity(entity, nestedEntityId, nodes, edges, processedIds);

    expect(nodes).toHaveLength(1);
    expect(nodes[0].name).toBe("kjkk");
    expect(edges).toHaveLength(1);
    expect(processedIds.has("DataSourceVariable-upraveny_nazev")).toBe(true);
  });
});

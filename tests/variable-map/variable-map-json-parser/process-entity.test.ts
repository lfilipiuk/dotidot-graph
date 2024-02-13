import { describe, it, expect, vi } from "vitest";
import { Edge } from "reactflow";
import { generateUniqueId } from "../../../src/variable-map/variable-map-json-parser/generate-unique-id";
import { createNode } from "../../../src/variable-map/variable-map-json-parser/create-node";
import { processEntity } from "../../../src/variable-map/variable-map-json-parser/process-entity";
import { ProcessedIds } from "../../../src/variable-map/types/types";
import { createEdge } from "../../../src/variable-map/variable-map-json-parser/create-edge";

vi.mock("@/variable-map/variable-map-json-parser/generate-unique-id", () => ({
  generateUniqueId: vi.fn(),
}));
vi.mock("@/variable-map/variable-map-json-parser/create-node", () => ({
  createNode: vi.fn(),
}));
vi.mock("@/variable-map/variable-map-json-parser/create-edge", () => ({
  createEdge: vi.fn(),
}));

describe("processEntity", () => {
  it("should generate a unique ID and manage node duplication", () => {
    const entity = { __typename: "DataSourceVariable", id: "1" };
    const nodes: any[] = [];
    const edges: Edge[] = [];
    const processedIds: ProcessedIds = new Set();
    const uniqueId = "DataSourceVariable-1";

    vi.mocked(generateUniqueId).mockReturnValue(uniqueId);
    vi.mocked(createNode).mockReturnValue({
      position: { x: 0, y: 0 },
      id: uniqueId,
      data: { label: entity.__typename },
    });

    processEntity(entity, null, nodes, edges, processedIds);
    expect(nodes).toHaveLength(1);
    expect(processedIds.has(uniqueId)).toBe(true);

    processEntity(entity, null, nodes, edges, processedIds);
    expect(nodes).toHaveLength(1);
    expect(processedIds.has(uniqueId)).toBe(true);
  });

  it("should correctly create edges based on entity type and conditions", () => {
    const entity = {
      __typename: "AdditionalSource",
      mappingField: "someField",
      id: "2",
    };
    const nodes = [{ id: "DataSourceVariable-someField", data: {} }];
    const edges: any[] = [];
    const processedIds = new Set();

    vi.mocked(createEdge).mockImplementation(({ source, target }) => ({
      id: `${source}-${target}`,
      source,
      target,
      type: "custom",
      arrowHeadType: "arrowclosed",
    }));
    vi.mocked(createNode).mockReturnValue({
      position: { x: 0, y: 0 },
      id: "AdditionalSource-2",
      data: { label: entity.__typename },
    });

    processEntity(entity, null, nodes as any, edges, processedIds as any);
    expect(nodes).toHaveLength(2);
    expect(edges).toHaveLength(1);
    expect(edges[0].source).toBe("DataSourceVariable-someField");
  });
});

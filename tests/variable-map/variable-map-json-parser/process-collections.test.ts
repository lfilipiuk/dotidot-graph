import { describe, it, expect } from "vitest";
import mockData from "../../../tests/data/mockData.json";
import { processCollections } from "../../../src/variable-map/variable-map-json-parser/process-collections";

describe("processCollections", () => {
  it("should correctly process entities and return nodes and edges", () => {

    const result = processCollections(mockData);
    expect(result.nodes).toHaveLength(33);
    expect(result.edges).toHaveLength(63);
  });
});
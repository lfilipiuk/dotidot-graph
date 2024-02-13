import { describe, it, expect } from 'vitest';
import {processCollections} from "../../src/variable-map/variable-map-json-parser.ts";
import data from "../../src/data/data.json";
import {JsonData} from "../../src/variable-map/types/types";

const mockData = data as JsonData;

describe('processCollections', () => {
    it('should correctly process entities and return nodes and edges', () => {
        const result = processCollections(mockData);

        // Example assertions
        expect(result).toHaveProperty('nodes');
        expect(result.nodes).toBeInstanceOf(Array);
        expect(result).toHaveProperty('edges');
        expect(result.edges).toBeInstanceOf(Array);
    });
});

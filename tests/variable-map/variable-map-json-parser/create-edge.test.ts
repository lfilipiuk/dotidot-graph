import { describe, it, expect } from 'vitest';
import {createEdge} from "../../../src/variable-map/variable-map-json-parser/create-edge";

describe('createEdge', () => {
    it('creates an edge with the correct properties', () => {
        const source = 'node1';
        const target = 'node2';
        const expectedEdge = {
            id: `edge-${source}-${target}`,
            source: source,
            target: target,
            type: "default",
            arrowHeadType: "arrowclosed",
        };

        const edge = createEdge({ source, target });

        expect(edge).toEqual(expectedEdge);
    });
});

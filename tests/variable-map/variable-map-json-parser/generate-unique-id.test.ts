import { describe, it, expect } from 'vitest';
import {EntityType} from "../../../src/variable-map/types/enums";
import {generateUniqueId} from "../../../src/variable-map/variable-map-json-parser/generate-unique-id";

describe('generateUniqueId', () => {
    it('returns unique ID with placeholderName for DataSourceVariable entities', () => {
        const entity = {
            __typename: EntityType.DataSourceVariable,
            placeholderName: 'examplePlaceholder',
            id: 123,
        };
        const expectedId = `${entity.__typename}-${entity.placeholderName}`;
        const uniqueId = generateUniqueId(entity);

        expect(uniqueId).toBe(expectedId);
    });

    it('returns unique ID with entity ID for non-DataSourceVariable entities', () => {
        const entity = {
            __typename: EntityType.AdwordsSetting,
            id: 456,
        };
        const expectedId = `${entity.__typename}-${entity.id.toString()}`;
        const uniqueId = generateUniqueId(entity);

        expect(uniqueId).toBe(expectedId);
    });
});
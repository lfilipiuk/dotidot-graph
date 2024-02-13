import {EntityCollection, JsonData, ProcessedIds} from "@/variable-map/types/types.ts";
import {Edge, Node} from "reactflow";

import {processEntities} from "@/variable-map/variable-map-json-parser/process-entities.ts";
import {entitiesToCreate} from "@/variable-map/variable-map-json-parser/entities-to-create.ts";

export function processCollections(jsonData: JsonData): {
    nodes: Node[];
    edges: Edge[];
} {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const processedIds: ProcessedIds = new Set<string>();

    entitiesToCreate.collections.forEach((collectionName: string) => {
        const key = collectionName as keyof EntityCollection;
        const collectionEntities = jsonData.data[key]?.[key];
        if (Array.isArray(collectionEntities)) {
            processEntities(collectionEntities, nodes, edges, null, processedIds);
        } else {
            console.error(
                `Expected an array for ${collectionName}, but received:`,
                collectionEntities,
            );
        }
    });

    return {nodes, edges};
}
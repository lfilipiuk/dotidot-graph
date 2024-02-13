import {Entity, ProcessedIds} from "@/variable-map/types/types.ts";
import {Edge, Node} from "reactflow";
import {processEntity} from "@/variable-map/variable-map-json-parser/process-entity.ts";

export function processEntities(
    collection: Entity[],
    nodes: Node[],
    edges: Edge[],
    parentId: string | null = null,
    processedIds: ProcessedIds,
): void {
    collection.forEach((entity) =>
        processEntity(entity, parentId, nodes, edges, processedIds),
    );
}
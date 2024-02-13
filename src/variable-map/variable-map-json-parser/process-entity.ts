import {Entity, ProcessedIds} from "@/variable-map/types/types.ts";
import {Edge, Node} from "reactflow";
import {generateUniqueId} from "@/variable-map/variable-map-json-parser/generate-unique-id.ts";
import {createNode} from "@/variable-map/variable-map-json-parser/create-node.ts";
import {
    EntitySpecificProperty,
    EntityType,
} from "@/variable-map/types/enums.ts";
import {createEdge} from "@/variable-map/variable-map-json-parser/create-edge.ts";
import {processEntities} from "@/variable-map/variable-map-json-parser/process-entities.ts";
import {getEntitySpecificProperties} from "@/variable-map/variable-map-json-parser/get-entity-properties.ts";
import {
    generateEdgesFromVariablesToEntity
} from "@/variable-map/variable-map-json-parser/generate-edges-from-variables.ts";

export function processEntity(
    entity: Entity,
    nestedEntityId: string | null,
    nodes: Node[],
    edges: Edge[],
    processedIds: ProcessedIds,
) {
    const uniqueId = generateUniqueId(entity);
    const nodeAlreadyExists = processedIds.has(uniqueId);

    if (!nodeAlreadyExists) {
        processedIds.add(uniqueId);
    }

    let node = createNode(entity, uniqueId);

    if (nodeAlreadyExists) {
        const existingNodeIndex = nodes.findIndex((n) => n.id === uniqueId);
        if (existingNodeIndex !== -1) {
            const existingNode = nodes[existingNodeIndex];
            Object.assign(existingNode, node);
            node = existingNode;
        }
    } else {
        nodes.push(node);
    }

    //Type specific logic
    if (
        entity.__typename === EntityType.AdditionalSource &&
        entity.mappingField
    ) {
        const dataSourceVariableId = `${EntityType.DataSourceVariable}-${entity.mappingField}`;
        const dataSourceVariableExists = nodes.some(
            (node) => node.id === dataSourceVariableId,
        );
        if (dataSourceVariableExists) {
            edges.push(
                createEdge({source: dataSourceVariableId, target: uniqueId}),
            );
        }
    } else if (
        entity.__typename === EntityType.AdditionalSource &&
        nestedEntityId
    ) {
        edges.push(createEdge({source: uniqueId, target: nestedEntityId}));
    } else {
        if (entity.parentId && entity.parentId !== 0) {
            const parentUniqueId = `${entity.__typename}-${entity.parentId}`;
            edges.push(createEdge({source: parentUniqueId, target: node.id}));
        } else if (
            nestedEntityId &&
            entity.__typename !== EntityType.DataSourceVariable
        ) {
            edges.push(createEdge({source: nestedEntityId, target: node.id}));
        }
    }

    generateEdgesFromVariablesToEntity(entity, node, edges);

    const entityProperties = getEntitySpecificProperties(entity);

    entityProperties.forEach((property) => {
        const propertyValue = entity[property as keyof Entity];
        if (Array.isArray(propertyValue)) {
            if (property === EntitySpecificProperty.BaseAdtexts) {
                processEntities(
                    propertyValue as Entity[],
                    nodes,
                    edges,
                    node.id,
                    processedIds,
                );
            } else {
                propertyValue.forEach((nestedEntity: Entity) =>
                    processEntity(nestedEntity, node.id, nodes, edges, processedIds),
                );
            }
        } else if (propertyValue) {
            processEntity(
                propertyValue as Entity,
                node.id,
                nodes,
                edges,
                processedIds,
            );
        }
    });
}
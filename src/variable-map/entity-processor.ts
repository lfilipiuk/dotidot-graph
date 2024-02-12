import {
  createEdge,
  createNode,
} from "@/variable-map/variable-map-construction.ts";
import { Node, Edge } from "reactflow";
import {
  Entity,
  EntityCollection,
  JsonData,
} from "@/variable-map/types.ts";
import { entityConfig } from "@/variable-map/utils/config.ts";
import { generateUniqueId } from "@/variable-map/utils/generate-unique-id.ts";
import { EntitySpecificProperty, EntityType } from "@/variable-map/enums.ts";

type ProcessedIds = Set<string>;

function processEntity(
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
        createEdge({ source: dataSourceVariableId, target: uniqueId }),
      );
    }
  } else if (
    entity.__typename === EntityType.AdditionalSource &&
    nestedEntityId
  ) {
    edges.push(createEdge({ source: uniqueId, target: nestedEntityId }));
  } else {
    if (entity.parentId && entity.parentId !== 0) {
      const parentUniqueId = `${entity.__typename}-${entity.parentId}`;
      edges.push(createEdge({ source: parentUniqueId, target: node.id }));
    } else if (
      nestedEntityId &&
      entity.__typename !== EntityType.DataSourceVariable
    ) {
      edges.push(createEdge({ source: nestedEntityId, target: node.id }));
    }
  }

  processPlaceholders(entity, node, edges);

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

function getEntitySpecificProperties(entity: Entity): string[] {
  return entityConfig.entitySpecificProperties[entity.__typename] || [];
}

function processEntities(
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
export function processCollections(jsonData: JsonData): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const processedIds: ProcessedIds = new Set<string>();

  entityConfig.collections.forEach((collectionName: string) => {
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

  return { nodes, edges };
}

function processPlaceholders(entity: Entity, node: Node, edges: Edge[]): void {
  const combinedPlaceholders = [
    ...(entity.getPlaceholdersWithoutConditions || []),
    ...(entity.getConditionsPlaceholders || []),
    ...(entity.imageGen
      ? entity.imageGen.getPlaceholdersWithoutConditions
      : []),
    ...(entity.imageGen ? entity.imageGen.getConditionsPlaceholders : []),
  ];

  const uniqueEdges = new Set(
    edges.map((edge) => `${edge.target}-${edge.source}`),
  );

  combinedPlaceholders.forEach((placeholder) => {
    const placeholderId = `${EntityType.DataSourceVariable}-${placeholder}`;
    const edgeIdentifier = `${node.id}-${placeholderId}`;

    if (!uniqueEdges.has(edgeIdentifier)) {
      uniqueEdges.add(edgeIdentifier);
      edges.push(createEdge({ source: placeholderId, target: node.id }));
    }
  });
}

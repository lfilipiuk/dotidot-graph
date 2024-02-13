import { Node, Edge } from "reactflow";
import {
  Entity,
  EntityCollection,
  JsonData,
} from "@/variable-map/types/types.ts";
import { generateUniqueId } from "@/variable-map/utils/generate-unique-id.ts";
import {
  EntityCollectionName,
  EntitySpecificProperty,
  EntityType,
  NodeType,
} from "@/variable-map/types/enums.ts";

type ProcessedIds = Set<string>;

const entityConfig = {
  entitySpecificProperties: {
    CampaignSetting: [
      EntitySpecificProperty.BidRules,
      EntitySpecificProperty.BaseAdtexts,
      EntitySpecificProperty.KeywordSettings,
      EntitySpecificProperty.AdwordsSetting,
    ],
    DataSourceVariable: [EntitySpecificProperty.AdditionalSource],
    FeedExport: [],
    AdditionalSource: [],
  } as { [key: string]: string[] },
  collections: [
    EntityCollectionName.Variables,
    EntityCollectionName.FeedExports,
    EntityCollectionName.AdditionalSources,
    EntityCollectionName.CampaignSettings,
  ],
};

function createNode(entity: Entity, uniqueId: string): Node {
  const typeName = entity.__typename;
  const label = entity.name || typeName || entity.id.toString();
  const type = getNodeType(entity);

  return {
    id: uniqueId,
    type: "custom-node",
    data: {
      ...entity,
      label: label,
      type: type,
    },
    position: { x: 0, y: 0 },
    width: 200,
    height: 50,
  };
}

function createEdge({ source, target }: { source: string; target: string }) {
  return {
    id: `edge-${source}-${target}`,
    source: source,
    target: target,
    type: "default",
    arrowHeadType: "arrowclosed",
  };
}

const getNodeType = (data: Entity): NodeType => {
  // Handle the special cases for DataSourceVariable with specific id patterns
  if (data.__typename === EntityType.DataSourceVariable) {
    if (data.id.toString().includes("DataField")) {
      return NodeType.Variable;
    } else if (data.id.toString().includes("Modifier")) {
      return NodeType.Modifier;
    }
  }

  switch (data.__typename) {
    case EntityType.AdditionalSource:
      return NodeType.AdditionalSource;
    case EntityType.CampaignSetting:
      return NodeType.Campaign;
    case EntityType.FeedExport:
      return NodeType.FeedExport;
    case EntityType.KeywordSetting:
      return NodeType.KeywordSetting;
    case EntityType.AdwordsSetting:
      return NodeType.AdwordsSetting;
    case EntityType.BaseAdtext:
      return NodeType.BaseAdtext;
    case EntityType.BidRule:
      return NodeType.BidRule;
    default:
      return NodeType.Default;
  }
};

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

function generateEdgesFromVariablesToEntity(entity: Entity, node: Node, edges: Edge[]): void {
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

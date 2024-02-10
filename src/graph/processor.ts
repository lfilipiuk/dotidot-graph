import { createEdge, createNode } from "@/graph/graph-construction.ts";

function processEntity(
  entity: any,
  parentId: string | null,
  nodes: any[],
  edges: any[],
  processedIds: Set<string>,
) {
  let uniqueId = generateUniqueId(entity);

  //TODO: handle unique
  //if (processedIds.has(uniqueId)) return;
  processedIds.add(uniqueId);

  let node = createNode(entity, uniqueId);
  nodes.push(node);

  if (entity.parentId && entity.parentId !== 0) {
    const parentUniqueId = `${entity.__typename}-${entity.parentId}`;
    edges.push(createEdge({ source: parentUniqueId, target: node.id }));
    //TODO: put types in a separate file
  } else if (parentId && entity.__typename !== "DataSourceVariable") {
    edges.push(createEdge({ source: parentId, target: node.id }));
  }

  processPlaceholders(entity, node, edges);

  const entityProperties = getEntitySpecificProperties(entity);

  entityProperties.forEach((property) => {
    const nestedEntities = entity[property];
    if (Array.isArray(nestedEntities)) {
      //TODO: make it more generic
      if (property === "baseAdtexts") {
        processAsChain(nestedEntities, node.id, nodes, edges, processedIds);
      } else {
        nestedEntities.forEach((nestedEntity) =>
          processEntity(nestedEntity, node.id, nodes, edges, processedIds),
        );
      }
    } else if (nestedEntities) {
      processEntity(nestedEntities, node.id, nodes, edges, processedIds);
    }
  });
}

function getEntitySpecificProperties(entity: any): string[] {
  switch (entity.__typename) {
    case "CampaignSetting":
      return ["bidRules", "baseAdtexts", "keywordSettings", "adwordsSetting"];
    case "DataSourceVariable":
      return ["additionalSource"];
    case "FeedExport":
    case "AdditionalSource":
      return [];
    default:
      return [];
  }
}

function processCollection(
  collection: any[],
  nodes: any[],
  edges: any[],
  parentId: string | null = null,
  processedIds: Set<string>,
) {
  collection.forEach((entity) =>
    processEntity(entity, parentId, nodes, edges, processedIds),
  );
}

function processAsChain(
  entities: any[],
  parentId: string,
  nodes: any[],
  edges: any[],
  processedIds: Set<string>,
) {
  entities.forEach((entity) =>
    processEntity(entity, parentId, nodes, edges, processedIds),
  );
}

export function processAllCollections(jsonData: { data: any }) {
  let nodes: any[] = [];
  let edges: any[] = [];
  let processedIds = new Set<string>(); // To track processed entities

  const collections = [
    "variables",
    "feedExports",
    "additionalSources",
    "campaignSettings",
  ];

  collections.forEach((collectionName) => {
    const collectionEntities = jsonData.data[collectionName][collectionName];
    processCollection(collectionEntities, nodes, edges, null, processedIds);
  });

  return { nodes, edges };
}

function processPlaceholders(entity: any, node: any, edges: any[]) {
  // Combine both sets of placeholders to avoid processing them separately
  const combinedPlaceholders = [
    ...(entity.getPlaceholdersWithoutConditions || []),
    ...(entity.getConditionsPlaceholders || []),
    ...(entity.imageGen
      ? entity.imageGen.getPlaceholdersWithoutConditions || []
      : []),
    ...(entity.imageGen ? entity.imageGen.getConditionsPlaceholders || [] : []),
  ];

  // Use a Set to track unique edge identifiers
  const uniqueEdges = new Set(
    edges.map((edge) => `${edge.source}-${edge.target}`),
  );

  combinedPlaceholders.forEach((placeholder) => {
    const placeholderId = `DataSourceVariable-${placeholder}`;
    const edgeIdentifier = `${node.id}-${placeholderId}`;

    // Only add the edge if it's not already tracked
    if (!uniqueEdges.has(edgeIdentifier)) {
      uniqueEdges.add(edgeIdentifier);
      edges.push(createEdge({ source: node.id, target: placeholderId }));
    }
  });
}

function generateUniqueId(entity: any): string {
  if (entity.__typename === "DataSourceVariable") {
    return `${entity.__typename}-${entity.placeholderName}`;
  } else {
    return `${entity.__typename}-${entity.id.toString()}`;
  }
}

import { createEdge, createNode } from "./graph-construction.ts";

export function findNodesAndEdgesInData(jsonData: { data: any }) {
  let nodes: {
    id: any;
    type: string;
    data: any;
    position: { x: number; y: number };
  }[] = [];
  let edges: {
    id: string;
    source: any;
    target: any;
    type: string;
    arrowHeadType: string;
  }[] = [];

  // Helper function to process nested settings and create nodes and edges
  function processSetting(entity: any, parentId: any) {
    const node = createNode(entity);
    nodes.push(node);

    // Create an edge from the setting to its parent campaign setting
    if (parentId) {
      edges.push(
        createEdge({
          source: parentId,
          target: node.id,
        }),
      );
    }

    if (node.data.children && node.data.children.length > 0) {
      edges.push(
        ...node.data.children.map((child: string) =>
          createEdge({
            source: child,
            target: node.id,
          }),
        ),
      );
    }

    // If the setting has further nested settings, process them recursively
    ["bidRules", "baseAdtexts", "keywordSettings", "adwordsSetting"].forEach(
      (settingType) => {
        const settingEntities = entity[settingType];
        if (Array.isArray(settingEntities)) {
          settingEntities.forEach((settingEntity) =>
            processSetting(settingEntity, node.id),
          );
        } else if (settingEntities) {
          // For non-array entities like adwordsSetting
          processSetting(settingEntities, node.id);
        }
      },
    );
  }

  // Initial processing for variables, exports, additional sources, and campaign settings
  const variablesAndExports = [
    ...jsonData.data.variables.variables,
    ...jsonData.data.feedExports.feedExports,
    ...jsonData.data.additionalSources.additionalSources,
    ...jsonData.data.campaignSettings.campaignSettings,
  ];

  variablesAndExports.forEach((entity) => {
    if (entity.__typename === "CampaignSetting") {
      // Process campaign settings and their nested entities
      processSetting(entity, null);
    } else {
      // Process regular variables and exports
      const node = createNode(entity);
      nodes.push(node);

      if (node.data.children && node.data.children.length > 0) {
        edges.push(
          ...node.data.children.map((child: string) =>
            createEdge({
              source: child,
              target: node.id,
            }),
          ),
        );
      }
    }
  });

  //remove duplicate edges
  edges = edges.filter(
    (edge, index, self) =>
      index ===
      self.findIndex(
        (t) => t.source === edge.source && t.target === edge.target,
      ),
  );

  return { nodes, edges };
}

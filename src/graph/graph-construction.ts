import { NodeColorKey, nodeColors } from "@/graph/node-colors.ts";

export function createNode(data: any) {
  const typeName: NodeColorKey = data.__typename as NodeColorKey;
  const borderColor = nodeColors[typeName] || "defaultColor";

  //if typename is DataSourceVariable then id is "DataSourceVariable-" + data.name
  let id = typeName + "-" + data.id.toString();
  if (typeName === "DataSourceVariable") {
    id = typeName + "-" + data.placeholderName;
  }

  // Mapping to variables
  const placeholdersWithoutConditions =
    data.getPlaceholdersWithoutConditions || [];
  const conditionsPlaceholders = data.getConditionsPlaceholders || [];

  let imageGenplaceholdersWithoutConditions = [];
  let imageGenConditionsPlaceholders = [];
  if (typeName === "DataSourceVariable") {
    imageGenplaceholdersWithoutConditions =
      data.imageGen?.getPlaceholdersWithoutConditions || [];
    imageGenConditionsPlaceholders =
      data.imageGen?.getConditionsPlaceholders || [];
  }

  const children = [
    ...placeholdersWithoutConditions,
    ...conditionsPlaceholders,
    ...imageGenplaceholdersWithoutConditions,
    ...imageGenConditionsPlaceholders,
  ].map((placeholder: string) => "DataSourceVariable-" + placeholder);

  //only for AdditionalSource
  if (typeName === "AdditionalSource") {
    children.push("DataSourceVariable-" + data.mappingField);
  }

  //only for DataSourceVariable
  if (typeName === "DataSourceVariable") {
    if (data.additionalSource)
      children.push("AdditionalSource-" + data.additionalSource.id);
  }

  return {
    id: id,
    type: "custom-node",
    data: {
      ...data,
      label: data.name,
      children: children,
      borderColor,
    },
    position: { x: 0, y: 0 },
  };
}

// @ts-ignore
export function createEdge({
  source,
  target,
}: {
  source: string;
  target: string;
}) {
  return {
    id: `edge-${source}-${target}`,
    source: source,
    target: target,
    type: "default",
    arrowHeadType: "arrowclosed",
  };
}

import { processCollections } from "@/variable-map/entity-processor.ts";
import { JsonData } from "@/variable-map/types.ts";

export const convertJsonToVariableMap = (jsonData: JsonData) => {
  const { nodes, edges } = processCollections(jsonData);
  return { nodes, edges };
};
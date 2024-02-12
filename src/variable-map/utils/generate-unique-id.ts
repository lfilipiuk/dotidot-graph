import { Entity } from "@/variable-map/types.ts";

export function generateUniqueId(entity: Entity): string {
  if (entity.__typename === "DataSourceVariable") {
    return `${entity.__typename}-${entity.placeholderName}`;
  } else {
    return `${entity.__typename}-${entity.id.toString()}`;
  }
}
import { Entity } from "@/variable-map/types/types.ts";
import { EntityType } from "@/variable-map/types/enums.ts";

export function generateUniqueId(entity: Entity): string {
  if (entity.__typename === EntityType.DataSourceVariable) {
    return `${entity.__typename}-${entity.placeholderName}`;
  } else {
    return `${entity.__typename}-${entity.id.toString()}`;
  }
}
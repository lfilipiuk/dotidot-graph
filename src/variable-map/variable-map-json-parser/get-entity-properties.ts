import {Entity} from "@/variable-map/types/types.ts";
import {entitiesToCreate} from "@/variable-map/variable-map-json-parser/entities-to-create.ts";

export function getEntitySpecificProperties(entity: Entity): string[] {
    return entitiesToCreate.entitySpecificProperties[entity.__typename] || [];
}
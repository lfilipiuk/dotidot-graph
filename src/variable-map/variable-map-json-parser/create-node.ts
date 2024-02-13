import {Entity} from "@/variable-map/types/types.ts";
import {Node} from "reactflow";

import {getNodeType} from "@/variable-map/variable-map-json-parser/get-node-type.ts";

export function createNode(entity: Entity, uniqueId: string): Node {
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
        position: {x: 0, y: 0},
        width: 200,
        height: 50,
    };
}
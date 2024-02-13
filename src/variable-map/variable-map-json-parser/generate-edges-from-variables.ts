import {Entity} from "@/variable-map/types/types.ts";
import {Edge, Node} from "reactflow";
import {EntityType} from "@/variable-map/types/enums.ts";
import {createEdge} from "@/variable-map/variable-map-json-parser/create-edge.ts";

export function generateEdgesFromVariablesToEntity(
    entity: Entity,
    node: Node,
    edges: Edge[],
): void {
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
            edges.push(createEdge({source: placeholderId, target: node.id}));
        }
    });
}
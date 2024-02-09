import {createFeedExportNode, createVariableNode} from "./node-creators.ts";
import {DotiNode} from "../types/types.ts";


export function createNode(data: any): DotiNode | null {
    switch(data.__typename) {
        case 'DataSourceVariable':
            return createVariableNode(data);
        case 'FeedExport':
            return createFeedExportNode(data);
        // Add cases for other __typename values
        default:
            return null; // Or throw an error if unexpected type
    }
}

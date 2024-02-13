//Initialize the baskets, set rules and Y position for each basket
import {Baskets} from "@/variable-map/types/types.ts";
import {NodeType} from "@/variable-map/types/enums.ts";

export function initializeBaskets(): Baskets {
    return {
        //Variables without a target go here
        dataFieldNoTarget: {
            nodes: [],
            config: {
                rules: (node, sourceTypesForNode) =>
                    node.data.type === NodeType.Variable &&
                    !(sourceTypesForNode[node.id]?.size > 0),
                startY: 0,
            },
        },
        //Additional sources go here
        additionalSource: {
            nodes: [],
            config: {
                rules: (node) => node.data.type === NodeType.AdditionalSource,
                startY: 25,
            },
        },
        //Variables with a target go here
        dataFieldWithTarget: {
            nodes: [],
            config: {
                rules: (node, sourceTypesForNode) =>
                    node.data.type === NodeType.Variable &&
                    sourceTypesForNode[node.id]?.size > 0,
                startY: 50,
            },
        },
        //Modifiers go here
        modifier: {
            nodes: [],
            config: {
                rules: (node) => node.data.type === NodeType.Modifier,
                startY: 75,
            },
        },
        //Campaign settings go here
        campaignSetting: {
            nodes: [],
            config: {
                rules: (node) => node.data.type === NodeType.Campaign,
                startY: 50,
            },
        },
        //Everything else goes here
        others: {nodes: [], config: {rules: () => true, startY: 0}},
    };
}
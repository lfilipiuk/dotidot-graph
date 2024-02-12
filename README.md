# Dotidot Variable Map

The Dotidot Variable Map is designed to visualize relationships between various entities, such as campaigns, variables, and sources, in a structured and interactive manner using React Flow. This setup is intended for demonstration purposes, suggesting a real-world application would involve fetching data from a live API.

### Core Features:
- **Data Fetching:** Utilizes a custom `useVariableMap` hook for fetching and processing data from a JSON source, converting it into a map of nodes and edges compatible with React Flow.
- **Configurable Entity Processing:** The process involves several key functions like `processCollections`, `processEntities`, and `processEntity` to dynamically parse and convert JSON data into a structured format that delineates different entities such as variables, campaign settings, and additional sources, making it adaptable to include new collections as needed.
- **Unique Identification and Merging:** A mechanism to generate unique identifiers for entities to manage potential ID conflicts and ensure accurate representation and merging of related entities.
- **Visual Layout Generation:** A layout generation algorithm (`generateLayout`) that organizes nodes into configurable "baskets" based on their relationships and types, ensuring a clear and logical visual representation.
- **Interactive Visualization:** The `VariableMap` component enhances user interaction with the variable map by enabling node selection, highlighting relationships, and providing an intuitive interface for exploring the connections between different entities.

### Implementation Details:
- **JSON Conversion and Node Creation:** The system parses JSON data, identifying and categorizing entities into nodes and edges with detailed logic for edge creation based on entity relationships. This includes handling nested entities and applying specific rules for connections between them.
- **Layout Strategy:** The layout algorithm employs a basket system for grouping nodes, adjusting their positions based on predefined rules and relationships, such as the presence of parent-child connections or specific entity types, to facilitate an organized and readable flowchart.
- **User Interaction:** Enhanced interaction features include functions for resetting highlight styles, highlighting selected nodes and their connections, and managing transparency and animation for a user-friendly experience.

## How it works?

### Data Fetching
Data is fetched from a [GitHub link]("https://gist.githubusercontent.com/ondrejbartas/1d1f070808fe582475a752fd8dd9bc5c/raw/03ff2c97e5b9576017be7ad70fa345ecf7dafc94/example_data.json") provided in the task description using the `useVariableMap` hook. This hook converts JSON data into a map of nodes and edges compatible with the React Flow library. Upon fetching, the hook generates a layout for visualization and provides essential data handling functionalities like setting nodes, edges, handling loading states, and error management.

#### useVariableMap
The hook converts JSON to a map of nodes and edges, compatible with [React Flow](https://reactflow.dev) Library.  
Then it generates a layout.  
It returns `nodes, edges, setNodes, setEdges, isLoading, error`.

### JSON Conversion
The JSON data fetched contains multiple collections, and the code is prepared to work with them by specifying collections in the `entityConfig`. The `processCollections` function iterates through these collections and processes each entity within them using `processEntities`. This function, in turn, recursively processes each entity using `processEntity`, generating a unique identifier for each entity and creating nodes and edges accordingly based on their type and relationships.

#### processCollections
It uses `entityConfig`, where we can specify shape of our data. If a new collection is needed, we can add it here. If, in addition to `bidRules, baseAdtexts, keywordSettings, adwordsSeting` we need to add `bingSetting`, we can just add it here.

```
export const entityConfig = {
    entitySpecificProperties: {
        CampaignSetting: [
            EntitySpecificProperty.BidRules,
            EntitySpecificProperty.BaseAdtexts,
            EntitySpecificProperty.KeywordSettings,
            EntitySpecificProperty.AdwordsSetting,
        ],
        DataSourceVariable: [EntitySpecificProperty.AdditionalSource],
        FeedExport: [],
        AdditionalSource: [],
    } as { [key: string]: string[] },
collections: [
    EntityCollectionName.Variables,
    EntityCollectionName.FeedExports,
    EntityCollectionName.AdditionalSources,
    EntityCollectionName.CampaignSettings,
],
};
```

Function loops through specified collections and processes them using `processEntities.

#### processEntities
This function loops through each specified in config and processes it using `processEntity`

#### processEntity
A recursive function. It generates `uniqueId` for entity (because `id` is not enough, as some entities of different types may share the same `id`). It checks if entity already exists because it may have been already generated.
##### Why is uniqueId useful?
`additionalSource` in `additionalSources` collection may contain this information
```json
{
	"id": 17,
	"icon": "enrich-weather",
	"name": "Počasí #1",
	"mappingField": "Praha",
	"mappingFields": [],
	"__typename": "AdditionalSource"
}
```

While in `variables` it will be much smaller.
```json
{
	"id": "gid://ppcbee-controll/DataField/958",
	"name": "weather_today_temp_day",
	"placeholderName": "weather_today_temp_day",
	"showValueType": "number",
	"getPlaceholdersWithoutConditions": [],
	"getConditionsPlaceholders": [],
	"imageGen": null,
	"additionalSource": {
		"id": 17,
		"__typename": "AdditionalSource"
	},
	"__typename": "DataSourceVariable"
}
```

In such scenario, we should merge these objects together.

##### createNode
After creating `uniqueId`, we create node, an object compatible with React Flow, enriched with some extra data. This is when node type is set.

| Type | `__typename` | and |
| ---- | ---- | ---- |
| Variable | DataSourceVariable | `id` contains `DataField` |
| Modifier | DataSourceVariable | `id` contains `Modifier` |
| AdditionalSource | AdditionalSource |  |
| CampaignSetting | CampaignSetting |  |
| FeedExport | FeedExport |  |
| KeywordSetting | KeywordSetting |  |
| AdwordsSetting | AdwordsSetting |  |
| BaseAdtext | BaseAdtext |  |
| BidRule | BidRule |  |
| Default |  |  |

Then, we create edges.

##### Edge creation
Here, we handle scenarios for edge creation. Direction matters here.

1. `AdditionalSource` entity may have a `mappingField`. It's mapped to a variable, so an appropriate edge is generated from that variable to this additional source.
2. `AdditionalSource` may be nested in `DataSourceVariable` so function will receive `nestedEntityId` argument. Then, it creates an edge from that `AdditionalSource` to the `DataSourceVariable`.
3. An entity may have `parentId`. If it does, and it's different from `0` (meaning it's top level), it will create an edge to that parent. It assumes parent is the same type (use case for `BaseAdtext`).
4. Final use case is for any other nodes which have `nestedEntityId` which is not `DataSourceVariable` as these are handled separately. It just creates an edge.

Then `processPlaceholders` runs. It created edges from `DataSourceVariable` entities to nodes of currently processed entity, by checking `genPlaceholdersWithoutConditions`, `getConditionsPlaceholders` and if entity contains `imageGen` it will check placeholders for it as well. Then it creates edges from variables to entities.

##### Recursion
Now, recursion happens. `getEntitySpecificProperties` tells us, which properties within this entity type we should check. e.g. for `CampaignSetting` we will be checking below:
```
CampaignSetting: [  
  "bidRules",  
  "baseAdtexts",  
  "keywordSettings",  
  "adwordsSetting",  
], 
```

Now, `baseAdtexts` will be processed as a "chain" using `processEntities`. Otherwise, nested entities will be processed normally, one by one with recursive call of `processEntity`.

Finally, JSON is converted. Nodes and edges are created.



### Generating Layout
Once nodes and edges are created, the next step is to generate a layout for visualization. This involves positioning nodes within "baskets," each with specific entry conditions and starting positions on the Y-axis. The `generateLayout` function handles this process by initializing baskets, mapping edges to nodes, sorting nodes into baskets, calculating adjusted depths, and applying a waterfall effect to position nodes within each basket effectively.

#### generateLayout
`generateLayout` returns **new** array of nodes without modification of the original one. This may be useful for generating multiple layouts in the future. It starts with basket generation.

##### initializeBaskets
This was created to make code configurable. Each basket has a name, place for nodes and config, which contains entry rule and starting position on Y axis.

| name | rule | startY |
| ---- | ---- | ---- |
| dataFieldNoTarget | variables with no `target` edge (incoming) | 0 |
| additionalSources | additional source entities | 100 |
| dataFieldWithTarget | variables with `target` (assuming these are coming from additional sources) | 50 |
| modifier | modifiers | 150 |
| campaignSetting | campaign entities | 50 |
| others | everything else goes here | 0 |

##### mapEdgesToNodes
Edges and nodes are separate objects. Node doesn't know what edges it has. Edge knows the id of its target and source node. Node positions need to be set so nodes need to know what they are connected to. This function does exactly that. It returns `sourceTypesForNode` and `parentNodeIdForNode`.

`sourceTypesForNode` will be used to decide which nodes go into `dataFieldNoTarget` and which go into `dataFieldWithTarget`.

`parentNodeIdForNode` will be used to calculate depths (for moving on X axis for nodes of the same type in the same basket)

##### sortNodesIntoBaskets
Nodes are put into baskets, according to rules specifies in the config.

##### calculateAdjustedDepths
Now, depths are calculated. If node has a parent and parent is of the same type, we create depth. We do it recursively.

##### applyWaterfallEffect
Each basket will now receive a separate waterfall effect. First nodes are sorted according to their type within the basket. Then, for each node in the basket we move it below the previous node, and we move it to the right according to the depth.

There is a special use case here for `BaseAdtext`, where when moving horizontally, we move less than usual.

For each basket, we keep track, where we are on X axis, so next basket can start after that one.

Finally, `generateLayout` function finishes and nodes are returned with their positions.

### Variable Map
The `VariableMap` component, built on top of React Flow, extends its functionality to handle interactions within the variable map. It allows users to click on nodes or empty spaces within the map. Clicking on a node triggers functions to reset and highlight selected nodes, along with their connected edges and directly related nodes, providing a more interactive and intuitive exploration experience.
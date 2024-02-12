# Dotidot Variable Map

## How it works?

### Data Fetching

Data is fetched from [GitHub link]("https://gist.githubusercontent.com/ondrejbartas/1d1f070808fe582475a752fd8dd9bc5c/raw/03ff2c97e5b9576017be7ad70fa345ecf7dafc94/example_data.json") provided in task description using `useVariableMap` hook. In a real world scenario, this would be replaced with a call to a real API.

#### useVariableMap
The hook converts JSON to a map of nodes and edges, compatible with [React Flow](https://reactflow.dev) Library.
Then it generates a layout.
It returns `nodes, edges, setNodes, setEdges, isLoading, error`.

### JSON Conversion
JSON data contains collections. Code is prepared to work with multiple collections, but they need to be specified. `processAllCollections` func

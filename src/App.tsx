import { useEdgesState, useNodesState } from "reactflow";
import "reactflow/dist/style.css";
import { convertJson } from "@/graph/convert-json.ts";
import FlowGraph from "./components/flow-graph.tsx";

const { nodes, edges } = convertJson();

const App = () => {
  const [dotiNodes, setDotiNodes] = useNodesState(nodes);
  const [dotiEdges, setDotiEdges] = useEdgesState(edges);

  return (
    <div className={"h-screen"}>
      <FlowGraph
        nodes={dotiNodes}
        edges={dotiEdges}
        setNodes={setDotiNodes}
        setEdges={setDotiEdges}
      />
    </div>
  );
};

export default App;

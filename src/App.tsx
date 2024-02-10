import { useEffect } from "react";
import {useEdgesState, useNodesState} from "reactflow";
import "reactflow/dist/style.css";
import { convertJson } from "@/graph/convert-json.ts";
import FlowGraph from "./components/flow-graph.tsx";

const { nodes, edges } = convertJson();

const App = () => {
  const [dotiNodes, setDotiNodes] = useNodesState([]);
  const [dotiEdges, setDotiEdges] = useEdgesState([]);


  useEffect(() => {
    setDotiNodes(nodes);
    setDotiEdges(edges);
  }, []);

  return (
    <div style={{ height: 800 }}>
      <FlowGraph nodes={dotiNodes}
      edges={dotiEdges}
      />
    </div>
  );
};

export default App;

import { useEffect } from "react";
import { useNodesState } from "reactflow";
import "reactflow/dist/style.css";
import { convertJson } from "./nodeFactory/convert-json.ts";
import FlowGraph from "./components/flow-graph.tsx";

const App = () => {
  const [dotiNodes, setDotiNodes] = useNodesState([]);

  const { nodes } = convertJson();

  useEffect(() => {
    setDotiNodes(nodes);
  }, []);

  return (
    <div style={{ height: 800 }}>
      <FlowGraph nodes={dotiNodes} />
    </div>
  );
};

export default App;

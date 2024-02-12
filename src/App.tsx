import VariableMap from "@/components/variable-map";
import "reactflow/dist/style.css";
import { useVariableMap } from "@/hooks/use-variable-map";
import { Loader } from "@/components/ui/loader";
import NavBar from "@/components/nav-bar.tsx";

const App = () => {
  const { nodes, edges, setNodes, setEdges, error, isLoading } =
    useVariableMap();

  let content;

  if (error) {
    content = <p>{error}</p>;
  } else if (isLoading) {
    content = <Loader />;
  } else {
    content = (
      <VariableMap
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
      />
    );
  }

  return (
    <div className={"h-dvh"}>
      <NavBar />
      <div className="h-5/6 border mx-5 rounded-xl shadow-sm flex items-center justify-center">{content}</div>
    </div>
  );
};

export default App;

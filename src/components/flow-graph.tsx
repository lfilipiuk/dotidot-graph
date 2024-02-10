import ReactFlow, {Background, Controls, Edge, MiniMap, Node} from "reactflow";
import CustomNode from "@/components/custom-node.tsx";

type FlowGraphProps = {
  nodes: Node[];
  edges: Edge[];
};

const nodeTypes = {
    'custom-node': CustomNode,
};

const FlowGraph = ({ nodes, edges }: FlowGraphProps) => {
  return (
    <ReactFlow
        nodesConnectable={false}
        nodeTypes={nodeTypes}
        edges={edges}
        nodes={nodes} fitView>
      <MiniMap />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

export default FlowGraph;

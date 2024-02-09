import ReactFlow, { Background, Controls, MiniMap, Node } from "reactflow";
import CustomNode from "@/components/custom-node.tsx";

type FlowGraphProps = {
  nodes: Node[];
};

const nodeTypes = {
    'custom-node': CustomNode,
};

const FlowGraph = ({ nodes }: FlowGraphProps) => {
    console.log(nodes);
  return (
    <ReactFlow
        nodesConnectable={false}
        nodeTypes={nodeTypes}
        nodes={nodes} fitView>
      <MiniMap />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

export default FlowGraph;

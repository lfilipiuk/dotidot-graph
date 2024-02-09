import ReactFlow, { Background, Controls, MiniMap, Node } from "reactflow";

type FlowGraphProps = {
  nodes: Node[];
};

const FlowGraph = ({ nodes }: FlowGraphProps) => {
    console.log(nodes);
  return (
    <ReactFlow
        nodesConnectable={false}
        nodes={nodes} fitView>
      <MiniMap />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

export default FlowGraph;

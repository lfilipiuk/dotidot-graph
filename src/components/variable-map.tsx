import ReactFlow, { Controls, Edge, Node } from "reactflow";
import CustomNode from "@/components/custom-node.tsx";

type VariableMapProps = {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
};

const nodeTypes = {
  "custom-node": CustomNode,
};
const VariableMap = ({
  nodes,
  edges,
  setNodes,
  setEdges,
}: VariableMapProps) => {
  const resetHighlight = (): void => {
    const updatedNodes = nodes.map((node) => ({
      ...node,
      style: { ...node.style, opacity: 1 },
    }));

    const updatedEdges = edges.map((edge) => ({
      ...edge,
      animated: false,
      style: { ...edge.style, stroke: "#a6a6a6", opacity: 1 },
    }));

    setNodes(updatedNodes);
    setEdges(updatedEdges);
  };

  const highlightSelection = (targetNode: Node): void => {
    // Determine IDs of nodes directly connected to the targetNode
    const connectedNodeIds = new Set();
    edges.forEach((edge) => {
      if (edge.source === targetNode.id) {
        connectedNodeIds.add(edge.target);
      } else if (edge.target === targetNode.id) {
        connectedNodeIds.add(edge.source);
      }
    });

    // Update nodes: set the target node and connected nodes as active
    const updatedNodes = nodes.map((node) => {
      const isActive =
        node.id === targetNode.id || connectedNodeIds.has(node.id);
      const opacity = isActive ? 1 : 0.25;
      return {
        ...node,
        style: { ...node.style, opacity },
        data: { ...node.data, active: isActive },
      };
    });

    // Update edges: animate edges connected to the target node
    const updatedEdges = edges.map((edge) => {
      const isSourceOrTarget =
        edge.source === targetNode.id || edge.target === targetNode.id;
      const strokeColor = isSourceOrTarget ? "#000" : "#a6a6a6";
      const opacity = isSourceOrTarget ? 1 : 0.75; // Highlight active nodes more prominently
      return {
        ...edge,
        animated: isSourceOrTarget,
        style: { ...edge.style, stroke: strokeColor, opacity },
      };
    });

    // Apply the updated nodes and edges to the variable-map
    setNodes(updatedNodes);
    setEdges(updatedEdges);
  };

  const onPaneClick = () => {
    resetHighlight();
  };

  return (
    <ReactFlow
      nodesConnectable={false}
      nodeTypes={nodeTypes}
      edges={edges}
      nodes={nodes}
      proOptions={{ hideAttribution: true }}
      fitView
      edgesFocusable={false}
      onNodeClick={(_event, node) => {
        resetHighlight();
        highlightSelection(node);
      }}
      onPaneClick={onPaneClick}
    >
      <Controls />
    </ReactFlow>
  );
};

export default VariableMap;

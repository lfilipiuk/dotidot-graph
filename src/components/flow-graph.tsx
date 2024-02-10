import ReactFlow, {
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
} from "reactflow";
import CustomNode from "@/components/custom-node.tsx";
import { useCallback } from "react";

type FlowGraphProps = {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
};

const nodeTypes = {
  "custom-node": CustomNode,
};

const FlowGraph = ({ nodes, edges, setNodes, setEdges }: FlowGraphProps) => {
  const resetHighlight = (): void => {
    const updatedNodes = nodes.map((node) => ({
      ...node,
      style: { ...node.style, opacity: 1 },
    }));

    const updatedEdges = edges.map((edge) => ({
      ...edge,
      animated: false,
    }));

    setNodes(updatedNodes);
    setEdges(updatedEdges);
  };

  const highlightPath = (targetNode: Node): void => {
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
      const opacity = isActive ? 1 : 0.25; // Highlight active nodes more prominently
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
      return {
        ...edge,
        animated: isSourceOrTarget,
      };
    });

    // Apply the updated nodes and edges to the graph
    setNodes(updatedNodes);
    setEdges(updatedEdges);
  };

  const onPaneClick = () => {
    resetHighlight();
  }

  return (
    <ReactFlow
      nodesConnectable={false}
      nodeTypes={nodeTypes}
      edges={edges}
      nodes={nodes}
      fitView
      onNodeClick={(_event, node) => {
        resetHighlight();
        highlightPath(node);
      }}
      onPaneClick={onPaneClick}
    >
      <MiniMap />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

export default FlowGraph;

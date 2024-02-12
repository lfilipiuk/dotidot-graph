import { useState, useEffect } from "react";
import { useNodesState, useEdgesState } from "reactflow";
import { convertJsonToVariableMap } from "@/variable-map/convert-json-to-variable-map";
import { generateLayout } from "@/variable-map/graph-layout.ts";

export function useVariableMap() {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    let isMounted = true;

    async function loadGraphData() {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://gist.githubusercontent.com/ondrejbartas/1d1f070808fe582475a752fd8dd9bc5c/raw/03ff2c97e5b9576017be7ad70fa345ecf7dafc94/example_data.json",
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        const { nodes: initialNodes, edges: initialEdges } =
          convertJsonToVariableMap(jsonData);

        const layoutedNodes = generateLayout(initialNodes, initialEdges);

        if (isMounted) {
          setNodes(layoutedNodes);
          setEdges(initialEdges);
        }
      } catch (e) {
        console.error(e);
        if (isMounted) {
          setError("Failed to load graph data. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadGraphData();

    return () => {
      isMounted = false;
    };
  }, [setNodes, setEdges]);

  return { nodes, edges, setNodes, setEdges, error, isLoading };
}

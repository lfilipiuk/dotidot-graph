import { useState, useEffect, useCallback } from "react";
import { useNodesState, useEdgesState } from "reactflow";
import {processCollections} from "@/variable-map/variable-map-json-parser/process-collections.ts";
import {generateLayout} from "@/variable-map/variable-map-layout-generator/generate-layout.ts";
import {entitiesToCreate} from "@/variable-map/variable-map-json-parser/entities-to-create.ts";

const fetchData = async () => {
  const demoUrl =
    "https://gist.githubusercontent.com/ondrejbartas/1d1f070808fe582475a752fd8dd9bc5c/raw/03ff2c97e5b9576017be7ad70fa345ecf7dafc94/example_data.json";
  const response = await fetch(demoUrl);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export function useVariableMap() {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadGraphData = useCallback(async () => {
    setIsLoading(true);
    try {
      const jsonData = await fetchData();
      const { nodes: initialNodes, edges: initialEdges } =
        processCollections(jsonData, entitiesToCreate);
      const layoutedNodes = generateLayout(initialNodes, initialEdges);

      setNodes(layoutedNodes);
      setEdges(initialEdges);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to load graph data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [setEdges, setNodes]);

  useEffect(() => {
    loadGraphData();
  }, [loadGraphData]);

  return { nodes, edges, setNodes, setEdges, error, isLoading };
}

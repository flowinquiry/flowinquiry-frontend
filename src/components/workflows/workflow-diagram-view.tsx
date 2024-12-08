"use client";

import "@xyflow/react/dist/style.css";

import dagre from "@dagrejs/dagre";
import {
  addEdge,
  Background,
  Connection,
  ConnectionLineType,
  Edge,
  Node,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import React, { useCallback, useEffect, useState } from "react";

import { WorkflowDetailDTO } from "@/types/workflows";

const nodeWidth = 172;
const nodeHeight = 36;

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const getLayoutElements = (
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "TB",
): { nodes: Node[]; edges: Edge[] } => {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

const convertStatesToNodes = (workflowDetails: WorkflowDetailDTO): Node[] => {
  return workflowDetails.states.map((state) => ({
    id: state.id!.toString(),
    data: { label: state.stateName },
    style: {
      backgroundColor: state.isInitial
        ? "var(--initial-node-bg)" // Initial node background
        : state.isFinal
          ? "var(--final-node-bg)" // Final node background
          : "var(--intermediate-node-bg)", // Intermediate node background
      color: "var(--node-text-color)", // Text color
      border: "1px solid var(--node-border-color)", // Border color
      borderRadius: "6px",
    },
    position: { x: 0, y: 0 },
    type: "default",
  }));
};

const convertTransitionsToEdges = (
  workflowDetails: WorkflowDetailDTO,
): Edge[] => {
  return workflowDetails.transitions
    .filter(
      (transition) =>
        transition.sourceStateId !== null &&
        transition.targetStateId !== null &&
        workflowDetails.states.some(
          (state) => state.id === transition.sourceStateId,
        ) &&
        workflowDetails.states.some(
          (state) => state.id === transition.targetStateId,
        ),
    ) // Ensure source and target states exist
    .map((transition, index) => ({
      id: `e${transition.sourceStateId}-${transition.targetStateId}-${index}`, // Add index to ensure uniqueness
      source: transition.sourceStateId!.toString(),
      target: transition.targetStateId!.toString(),
      label: transition.eventName,
      type: ConnectionLineType.SmoothStep,
      animated: true,
      style: {
        stroke: "var(--edge-color)", // Edge color
      },
    }));
};

// Main Flow Component
export const WorkflowDiagram: React.FC<{
  workflowDetails: WorkflowDetailDTO;
}> = ({ workflowDetails }) => {
  const [theme, setTheme] = useState(
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);

  useEffect(() => {
    // Observe changes in the dark class
    const observer = new MutationObserver(() => {
      setTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light",
      );
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function initNodesAndEdges() {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutElements(
        convertStatesToNodes(workflowDetails),
        convertTransitionsToEdges(workflowDetails),
      );
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
    initNodesAndEdges();
  }, [workflowDetails]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds,
        ),
      ),
    [setEdges],
  );

  const styles =
    theme === "dark"
      ? {
          "--initial-node-bg": "#81C784",
          "--final-node-bg": "#FF8A65",
          "--intermediate-node-bg": "#64B5F6",
          "--node-text-color": "#F9FAFB",
          "--node-border-color": "#4B5563",
          "--edge-color": "#FFFFFF",
          "--background-color": "#1E293B",
          "--grid-color": "#374151",
        }
      : {
          "--initial-node-bg": "#4CAF50",
          "--final-node-bg": "#FF5722",
          "--intermediate-node-bg": "#2196F3",
          "--node-text-color": "#000000",
          "--node-border-color": "#D1D5DB",
          "--edge-color": "#9CA3AF",
          "--background-color": "#F7F9FB",
          "--grid-color": "#E5E7EB",
        };

  return (
    <ReactFlowProvider>
      <div
        className="workflow-container w-full h-[50rem]"
        style={{ ...styles, backgroundColor: "var(--background-color)" }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
        >
          <Background
            gap={16}
            size={1}
            color="var(--grid-color)" // Grid color
          />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

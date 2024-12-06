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
import React, { useCallback, useEffect } from "react";

import { WorkflowDetailedDTO } from "@/types/workflows";

// Constants for node dimensions
const nodeWidth = 172;
const nodeHeight = 36;

// Configure Dagre graph
const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

// Function to layout nodes and edges
const getLayoutedElements = (
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

const convertStatesToNodes = (workflowDetails: WorkflowDetailedDTO): Node[] => {
  return workflowDetails.states.map((state) => ({
    id: state.id!.toString(), // Convert id to string as Node.id must be a string
    data: {
      label: state.stateName, // Label for the node
      backgroundColor: state.isInitial
        ? "#4CAF50" // Green for initial states
        : state.isFinal
          ? "#FF5722" // Red for final states
          : "#2196F3", // Blue for intermediate states
    },
    position: { x: 0, y: 0 }, // Default position; will be adjusted by layout
    type: "default", // Set type as default; can be customized further
  }));
};

const convertTransitionsToEdges = (
  workflowDetails: WorkflowDetailedDTO,
): Edge[] => {
  return workflowDetails.transitions.map((transition) => ({
    id: `e${transition.sourceStateId}-${transition.targetStateId}`, // Create a unique ID for the edge
    source: transition.sourceStateId.toString(), // Convert sourceStateId to string
    target: transition.targetStateId.toString(), // Convert targetStateId to string
    label: transition.eventName, // Use eventName as the label for the edge
    type: ConnectionLineType.SmoothStep, // Use SmoothStep for a curved line
    animated: true, // Enable animation for the edge
  }));
};

// Main Flow Component
export const WorkflowDiagram: React.FC<{
  workflowDetails: WorkflowDetailedDTO;
}> = ({ workflowDetails }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);

  useEffect(() => {
    function initNodesAndEdges() {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(
          convertStatesToNodes(workflowDetails),
          convertTransitionsToEdges(workflowDetails),
        );
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
    initNodesAndEdges();
  }, []);

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

  const onLayout = useCallback(
    (direction: "TB" | "LR") => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges],
  );

  return (
    <ReactFlowProvider>
      <div style={{ width: "100%", height: "50rem" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          style={{ backgroundColor: "#F7F9FB" }}
        >
          <Background />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

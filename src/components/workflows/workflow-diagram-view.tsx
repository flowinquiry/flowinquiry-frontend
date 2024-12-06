import "reactflow/dist/style.css";

import ELK from "elkjs/lib/elk.bundled.js";
import React, { useCallback, useLayoutEffect } from "react";
import {
  addEdge,
  Background,
  Connection,
  Edge,
  Node,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import { ZoomIn, ZoomOut } from "lucide-react";

import { WorkflowDetailedDTO } from "@/types/workflows";
import CustomNode from "@/components/workflows/workflow-custom-node";

const elk = new ELK();

const elkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "80",
};

const generateGraphElements = (
  workflowDetails: WorkflowDetailedDTO,
): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = workflowDetails.states.map((state) => ({
    id: state.id!.toString(),
    data: {
      label: state.stateName,
      backgroundColor: state.isInitial
        ? "#4CAF50"
        : state.isFinal
          ? "#FF5722"
          : "#2196F3",
    },
    position: { x: 0, y: 0 },
    type: "custom",
  }));

  const edges: Edge[] = workflowDetails.transitions.map((transition) => ({
    id: transition.id!.toString(),
    source: transition.sourceStateId.toString(),
    target: transition.targetStateId.toString(),
    label: transition.eventName,
    animated: true,
    type: "smoothstep",
  }));

  return { nodes, edges };
};

const getLayoutedElements = async (
  nodes: Node[],
  edges: Edge[],
  options: { "elk.direction"?: "UP" | "DOWN" | "LEFT" | "RIGHT" } = {},
): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  const isHorizontal = options["elk.direction"] === "RIGHT";

  const graph = {
    id: "root",
    layoutOptions: options,
    children: nodes.map((node) => ({
      id: node.id,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      width: 150,
      height: 50,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layoutedGraph = await elk.layout(graph);

  // Get the bounding box of the layout
  const minX = Math.min(
    ...layoutedGraph.children!.map((child) => child.x || 0),
  );
  const maxX = Math.max(
    ...layoutedGraph.children!.map(
      (child) => (child.x || 0) + (child.width || 0),
    ),
  );

  // Calculate the center offset to align the graph to the top-center
  const containerWidth = 800; // Assume a fixed width for the container or pass it dynamically
  const offsetX = (containerWidth - (maxX - minX)) / 2;

  return {
    nodes: (layoutedGraph.children || []).map((child) => ({
      id: child.id,
      position: { x: (child.x || 0) + offsetX, y: child.y || 0 },
      data: nodes.find((n) => n.id === child.id)?.data || {},
      type: nodes.find((n) => n.id === child.id)?.type || "default",
    })),
    edges: edges,
  };
};

const LayoutFlow: React.FC<{ workflowDetails: WorkflowDetailedDTO }> = ({
  workflowDetails,
}) => {
  const { nodes: initialNodes, edges: initialEdges } =
    generateGraphElements(workflowDetails);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { zoomIn, zoomOut } = useReactFlow();

  const onConnect = useCallback(
    (params: Edge<any> | Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onLayout = useCallback(
    ({ direction }: { direction: "DOWN" | "RIGHT" }) => {
      const opts = { "elk.direction": direction, ...elkOptions };

      getLayoutedElements(nodes, edges, opts).then(
        ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);
        },
      );
    },
    [nodes, edges, setNodes, setEdges],
  );

  useLayoutEffect(() => {
    onLayout({ direction: "DOWN" });
  }, [onLayout]);

  return (
    <div
      style={{
        width: "100%",
        height: "50rem",
        position: "sticky",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={{ custom: CustomNode }}
        style={{ backgroundColor: "#F7F9FB" }}
      >
        <Panel position="bottom-left">
          <button
            onClick={() => zoomIn()}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              margin: "0 5px",
            }}
          >
            <ZoomIn />
          </button>
          <button
            onClick={() => zoomOut()}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              margin: "0 5px",
            }}
          >
            <ZoomOut />
          </button>
        </Panel>
        <Background />
      </ReactFlow>
    </div>
  );
};

export default ({
  workflowDetails,
}: {
  workflowDetails: WorkflowDetailedDTO;
}) => (
  <ReactFlowProvider>
    <LayoutFlow workflowDetails={workflowDetails} />
  </ReactFlowProvider>
);
